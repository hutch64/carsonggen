import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const GENRE_PROMPTS = {
  "country": "country music, acoustic guitar, fiddle, twangy, Nashville sound, male vocalist, upbeat anthem",
  "rock": "rock music, electric guitar, drums, powerful, energetic, male vocalist, rock anthem",
  "hip-hop": "hip-hop, heavy bass, trap drums, urban, modern, rap vocals, male vocalist",
  "gospel": "gospel music, uplifting choir, organ, inspirational, soulful, powerful vocals",
  "r&b": "R&B, soulful, groovy bass, warm keys, smooth vocals, modern rhythm and blues",
  "pop": "pop music, upbeat, synth, modern production, radio-ready, catchy, male vocalist",
  "metal": "heavy metal, distorted guitar, double kick drums, aggressive, powerful, male vocalist",
  "jazz": "jazz, piano, upright bass, brushed drums, smooth, soulful vocals"
};

// Clean and convert lyrics into [verse]/[chorus] format for MiniMax
function formatLyrics(lyrics) {
  // Strip markdown bold/italic/headers and trailing spaces from line endings
  let cleaned = lyrics
    .replace(/\*\*(.*?)\*\*/g, '$1')   // bold
    .replace(/\*(.*?)\*/g, '$1')        // italic
    .replace(/^#+\s*/gm, '')            // headers
    .replace(/  $/gm, '')               // trailing double-space (markdown linebreak)
    .trim();

  // Already has MiniMax-style tags
  if (cleaned.includes('[verse]') || cleaned.includes('[chorus]')) return cleaned;

  // Convert labeled section headers like "Verse 1:", "Chorus:", etc.
  return cleaned
    .replace(/^verse\s*\d*:?\s*$/gim, '[verse]')
    .replace(/^chorus:?\s*$/gim, '[chorus]')
    .replace(/^bridge:?\s*$/gim, '[bridge]')
    .replace(/^outro:?\s*$/gim, '[outro]')
    .replace(/^pre-?chorus:?\s*$/gim, '[pre-chorus]')
    .trim();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const { action, genre, carDesc, lyrics, predictionId } = body;

    const apiToken = Deno.env.get("REPLICATE_API_TOKEN");
    if (!apiToken) return Response.json({ error: 'Missing API token' }, { status: 500 });

    // ACTION: start
    if (action === "start" || !action) {
      const prompt = GENRE_PROMPTS[genre] || "upbeat music, energetic, male vocalist, full song with vocals";
      const rawLyrics = lyrics
        ? formatLyrics(lyrics)
        : "[verse]\nRiding down the highway fast and free\nThis machine was built for you and me\n[chorus]\nRevving up the engine hear it roar\nThis car's an anthem worth living for";

      // MiniMax Music 1.5 requires lyrics between 10-600 characters
      const formattedLyrics = rawLyrics.length > 600 ? rawLyrics.substring(0, 597) + "..." : rawLyrics;

      const startRes = await fetch("https://api.replicate.com/v1/models/minimax/music-1.5/predictions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: {
            lyrics: formattedLyrics,
            prompt: prompt
          }
        })
      });

      const prediction = await startRes.json();
      console.log("Replicate response status:", startRes.status);
      console.log("Prediction response:", JSON.stringify(prediction).substring(0, 500));

      if (startRes.status >= 400) {
        console.error("Replicate API error:", JSON.stringify(prediction));
        return Response.json({ error: prediction.detail || prediction.error || "API error" }, { status: startRes.status });
      }

      if (prediction.error) {
        return Response.json({ error: prediction.error }, { status: 500 });
      }

      if (prediction.status === "succeeded" && prediction.output) {
        return Response.json({ status: "succeeded", audio_url: prediction.output });
      }

      return Response.json({ status: prediction.status, prediction_id: prediction.id });
    }

    // ACTION: poll
    if (action === "poll") {
      if (!predictionId) return Response.json({ error: 'Missing predictionId' }, { status: 400 });

      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: { "Authorization": `Bearer ${apiToken}` }
      });
      const status = await pollRes.json();
      console.log("Poll status:", status.status, "error:", status.error, "logs:", JSON.stringify(status.logs || "").substring(0, 300));

      if (status.status === "succeeded") {
        return Response.json({ status: "succeeded", audio_url: status.output });
      }

      if (status.status === "failed" || status.status === "canceled") {
        console.error("Prediction failed full details:", JSON.stringify(status));
        return Response.json({ status: "failed", error: status.error || "Generation failed" });
      }

      return Response.json({ status: status.status });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error("generateMusic error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});