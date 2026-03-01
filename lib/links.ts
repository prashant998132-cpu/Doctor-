export interface Tool {
  id: string
  name: string
  url: string
  category: string
  tag: string
  free: string
  trending?: boolean
  skillLevel?: 'beginner' | 'pro'
  noSignup?: boolean
  unlimited?: boolean
}

export const TOOLS: Tool[] = [
  // IMAGE GENERATION (31 tools)
  { id: 'zimage', name: 'Z-Image Turbo', url: 'https://huggingface.co/spaces/mrfakename/Z-Image-Turbo', category: 'image', tag: '⚡ Fast, No Signup', free: 'Unlimited', noSignup: true, unlimited: true, skillLevel: 'beginner' },
  { id: 'deepai', name: 'DeepAI', url: 'https://deepai.org/', category: 'image', tag: '🎨 Customizable Styles', free: 'Free (watermark)', noSignup: true },
  { id: 'seedream', name: 'Seedream', url: 'https://seedream.pro/', category: 'image', tag: '📸 Realistic, No Signup', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'flux', name: 'Flux AI', url: 'https://flux-ai.io/', category: 'image', tag: '✨ Flux Model, No Signup', free: 'Unlimited Hi-Res', noSignup: true, unlimited: true, trending: true, skillLevel: 'beginner' },
  { id: 'craiyon', name: 'Craiyon', url: 'https://www.craiyon.com/', category: 'image', tag: '🖼️ No Signup, Simple', free: 'Unlimited', noSignup: true, unlimited: true, skillLevel: 'beginner' },
  { id: 'ishchat', name: 'Ish Chat', url: 'https://ish.chat/', category: 'image', tag: '💬 Chat-Based Gen', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'flatai', name: 'FlatAI', url: 'https://flatai.org/ai-image-generator-free-no-signup/', category: 'image', tag: '🔒 Private Mode, 50+/day', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'perchance', name: 'Perchance', url: 'https://perchance.org/ai-text-to-image-generator', category: 'image', tag: '🔥 Batch Gen, Truly Unlimited', free: 'Truly Unlimited', noSignup: true, unlimited: true, trending: true, skillLevel: 'beginner' },
  { id: 'raphael', name: 'Raphael', url: 'https://raphael.app/', category: 'image', tag: '🌐 Multi-Model Router', free: '100% Unlimited', noSignup: true, unlimited: true, trending: true },
  { id: 'freegen', name: 'FreeGen', url: 'https://freegen.app/', category: 'image', tag: '✅ Hi-Quality, No Hidden Cost', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'notegpt', name: 'NoteGPT Image', url: 'https://notegpt.io/ai-image-generator', category: 'image', tag: '🆕 Latest Models, No Signup', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'magicstudio', name: 'Magic Studio', url: 'https://magicstudio.com/ai-art-generator', category: 'image', tag: '⚡ Lightning Fast', free: 'Unlimited Art Styles', noSignup: true, unlimited: true },
  { id: 'visualgpt', name: 'VisualGPT', url: 'https://visualgpt.io/ai-image-generator', category: 'image', tag: '🌙 Dreamy Images', free: 'Free Quick Gen', noSignup: true },
  { id: 'imagefree', name: 'ImageFree', url: 'https://imagefree.org/', category: 'image', tag: '💯 Truly Unlimited, Hi-Res', free: 'Unlimited No Credits', noSignup: true, unlimited: true },
  { id: 'drawfree', name: 'FreeForAI Draw', url: 'https://draw.freeforai.com/', category: 'image', tag: '🚀 FLUX.1-Dev, No Reg', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'upsamplerimg', name: 'Upsampler Image', url: 'https://upsampler.com/free-image-generator-no-signup', category: 'image', tag: '🎯 Multi-Models, No Signup', free: 'Unlimited Daily', noSignup: true, unlimited: true },
  { id: 'aifreeforever', name: 'AIFreeForever', url: 'https://aifreeforever.com/', category: 'image', tag: '🔥 1000+ Tools, No Signup', free: 'Unlimited', noSignup: true, unlimited: true, trending: true },
  { id: 'nightcafe', name: 'NightCafe', url: 'https://creator.nightcafe.studio/ai-image-generator', category: 'image', tag: '🎨 Free Credits + Models', free: 'Limited Credits', skillLevel: 'beginner' },
  { id: 'deepdream', name: 'DeepDream', url: 'https://deepdreamgenerator.com/generate', category: 'image', tag: '🌀 Good Quality', free: 'Limited Free' },
  { id: 'pixelbin', name: 'PixelBin', url: 'https://www.pixelbin.io/', category: 'image', tag: '🏢 Studio Quality', free: 'Unlimited T2I', noSignup: true, unlimited: true },
  { id: 'raphaelalt', name: 'Raphael AI Alt', url: 'https://raphaelai.org/', category: 'image', tag: '⚡ Fast Unlimited, Multi-Model', free: 'No Limits', noSignup: true, unlimited: true },
  { id: 'midgenai', name: 'MidGenAI', url: 'https://www.midgenai.com/text-to-image', category: 'image', tag: '📸 Realistic, No Watermark', free: 'Unlimited Free', noSignup: true, unlimited: true },
  { id: 'muryou', name: 'Muryou', url: 'https://muryou-aigazou.com/', category: 'image', tag: '🇯🇵 No Login, Multilingual', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'loboforge', name: 'LoboForge', url: 'https://loboforge.com/', category: 'image', tag: '👥 Community-Based', free: 'Unlimited Images', unlimited: true },
  { id: 'fluidfit', name: 'Fluidfit', url: 'https://fluidfit.ai/', category: 'image', tag: '100+ Models, Free Credits', free: 'Unlimited Requests' },
  { id: 'googleimagefx', name: 'Google ImageFX', url: 'https://labs.google/fx/tools/image-fx', category: 'image', tag: '🌟 Imagen Model, Google Labs', free: 'Unlimited', unlimited: true },
  { id: 'bingcreator', name: 'Bing Image Creator', url: 'https://www.bing.com/images/create', category: 'image', tag: '🖥️ Microsoft, Hi-Quality', free: 'Free Unlimited', unlimited: true },
  { id: 'canvaai', name: 'Canva AI Image', url: 'https://www.canva.com/ai-image-generator', category: 'image', tag: '🎨 Free Tier, No Watermark', free: 'Free Tier', skillLevel: 'beginner' },
  { id: 'geminiimg', name: 'Gemini Image', url: 'https://gemini.google.com/', category: 'image', tag: '🌟 Google, Text+Image', free: 'Free Account', unlimited: true },
  { id: 'arena', name: 'Arena AI', url: 'https://arena.ai/image', category: 'image', tag: '🏆 Model Comparison', free: 'Unlimited Voting+Gen', unlimited: true },
  { id: 'toolfkimg', name: 'ToolFK Text-to-Image', url: 'https://www.toolfk.com/tools/online-text-to-image.html', category: 'image', tag: '🛠️ Multi-Styles, No Signup', free: 'Unlimited', noSignup: true, unlimited: true },

  // IMAGE EDITING (10 tools)
  { id: 'toolfkremovetext', name: 'ToolFK Remove Text', url: 'https://www.toolfk.com/tools/ai-remove-text-from-image.html', category: 'image-edit', tag: '✂️ Instant, No Signup', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'toolfkeditor', name: 'ToolFK Image Editor', url: 'https://www.toolfk.com/tools/online-image-editor.html', category: 'image-edit', tag: '🖼️ Crop/Rotate/Filters', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'removebg', name: 'Remove.bg', url: 'https://www.remove.bg/', category: 'image-edit', tag: '✂️ BG Remover', free: 'Limited (low-res free)', skillLevel: 'beginner' },
  { id: 'clipdropbg', name: 'Clipdrop BG Remover', url: 'https://clipdrop.co/remove-background', category: 'image-edit', tag: '🤖 AI Remover, No Signup', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'magicstudiobg', name: 'Magic Studio BG', url: 'https://www.magicstudio.com/backgroundremover', category: 'image-edit', tag: '🎨 Free Remove+Edit', free: 'Unlimited', unlimited: true },
  { id: 'photoroom', name: 'PhotoRoom', url: 'https://www.photoroom.com/background-remover', category: 'image-edit', tag: '📸 Free Edit, No Signup', free: 'Hi-Quality', noSignup: true },
  { id: 'pixlr', name: 'Pixlr', url: 'https://pixlr.com/remove-background/', category: 'image-edit', tag: '🎨 AI Remover Free', free: 'Free Tier Unlimited', skillLevel: 'beginner' },
  { id: 'slazzer', name: 'Slazzer', url: 'https://www.slazzer.com/', category: 'image-edit', tag: '⚡ Auto Remove', free: 'Free Limited', skillLevel: 'beginner' },
  { id: 'fotor', name: 'Fotor', url: 'https://www.fotor.com/photo-editor/', category: 'image-edit', tag: '🖼️ AI Editor Unlimited', free: 'Free Unlimited Tools', skillLevel: 'beginner' },
  { id: 'photopea', name: 'Photopea', url: 'https://www.photopea.com/', category: 'image-edit', tag: '🎨 Photoshop Free Online', free: '100% Free', skillLevel: 'pro' },

  // IMAGE UPSCALING (13 tools)
  { id: 'vectorink', name: 'Vectorink', url: 'https://vectorink.io/en/upscaler', category: 'upscale', tag: '📐 Vector Upscale, No Signup', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'imgupscaler', name: 'ImgUpscaler', url: 'https://imgupscaler.ai/', category: 'upscale', tag: '🔍 4x AI Upscale', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'imageupscaling', name: 'Image Upscaling', url: 'https://image-upscaling.net/', category: 'upscale', tag: '🖼️ Free Online', free: 'Unlimited Low-Res', unlimited: true },
  { id: 'imggenupscale', name: 'ImgGen Upscale', url: 'https://imggen.ai/tools/upscale-image', category: 'upscale', tag: '⬆️ Upscale+Enhance', free: 'Free Unlimited', unlimited: true },
  { id: 'ninja', name: 'Ninja Upscale', url: 'https://ninjatransfers.com/pages/upscale', category: 'upscale', tag: '🖨️ Print Focus', free: 'Free Unlimited', unlimited: true },
  { id: 'imagefreeupscale', name: 'ImageFree Upscale', url: 'https://imagefree.org/image-upscale', category: 'upscale', tag: '💯 No Credits Needed', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'kreaupscale', name: 'Krea Upscaler', url: 'https://www.krea.ai/features/ai-upscaler', category: 'upscale', tag: '🚀 AI Upscale', free: 'Free Credits', trending: true },
  { id: 'kreaenhance', name: 'Krea Enhance', url: 'https://www.krea.ai/apps/enhance', category: 'upscale', tag: '✨ Image Enhance', free: 'Free Unlimited', unlimited: true },
  { id: 'neroai', name: 'Nero AI', url: 'https://ai.nero.com/image-upscaler', category: 'upscale', tag: '📸 Hi-Res, No Signup', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'upsamplerup', name: 'Upsampler Upscale', url: 'https://upsampler.com/free-image-upscaler-no-signup', category: 'upscale', tag: '⚡ GPU Upscale, No Signup', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'letsenhance', name: 'LetsEnhance', url: 'https://letsenhance.io/', category: 'upscale', tag: '🖼️ AI Enhance', free: 'Free Credits', unlimited: true },
  { id: 'clipdropupscale', name: 'Clipdrop Upscale', url: 'https://clipdrop.co/upscale', category: 'upscale', tag: '⚡ Fast Upscale', free: 'Unlimited', unlimited: true },
  { id: 'magichourupscale', name: 'MagicHour Upscale', url: 'https://magichour.ai/products/ai-image-upscaler', category: 'upscale', tag: '🎯 Professional', free: 'Free Tier' },

  // ART STYLE / TEXT TO VISUAL (7 tools)
  { id: 'toolfkghibli', name: 'ToolFK Ghibli Style', url: 'https://www.toolfk.com/tools/ai-ghibli-style.html', category: 'visual', tag: '🎌 Ghibli Art Free', free: 'Unlimited', noSignup: true, unlimited: true, trending: true, skillLevel: 'beginner' },
  { id: 'toolfklowpoly', name: 'ToolFK Low Poly', url: 'https://www.toolfk.com/tools/ai-low-poly.html', category: 'visual', tag: '🔺 Low-Poly Visual', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'toolfkpainting', name: 'ToolFK Painting', url: 'https://www.toolfk.com/tools/ai-photo-to-painting.html', category: 'visual', tag: '🎨 Van Gogh Style', free: 'Free', noSignup: true },
  { id: 'toolfkimgtovid', name: 'ToolFK Img-to-Video', url: 'https://www.toolfk.com/tools/online-img-to-video.html', category: 'visual', tag: '📹 Animated Convert', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'artbreeder', name: 'Artbreeder', url: 'https://www.artbreeder.com/', category: 'visual', tag: '🎭 Art Mix Free', free: 'Unlimited', unlimited: true },
  { id: 'deepart', name: 'DeepArt', url: 'https://www.deepart.io/', category: 'visual', tag: '🖼️ Photo-to-Art', free: 'Free Credits' },
  { id: 'nightcarestudio', name: 'NightCafe Studio', url: 'https://www.nightcafe.studio/', category: 'visual', tag: '🌙 Text-to-Art, Unlimited', free: 'Free Unlimited', unlimited: true },

  // VIDEO GENERATION / EDITING (31 tools)
  { id: 'upsamplervid', name: 'Upsampler Video', url: 'https://upsampler.com/free-video-generator-no-signup', category: 'video', tag: '🎬 No Signup, No Watermark', free: 'Unlimited Short', noSignup: true, unlimited: true, trending: true },
  { id: 'fiddl', name: 'Fiddl.art', url: 'https://fiddl.art/', category: 'video', tag: '🎮 Missions=Credits, 2026 New', free: 'Unlimited Credits', unlimited: true, trending: true },
  { id: 'pika', name: 'Pika Labs', url: 'https://pika.art/', category: 'video', tag: '🎬 Text/Image-to-Video', free: 'Unlimited Shorts', unlimited: true, trending: true },
  { id: 'vheer', name: 'Vheer', url: 'https://vheer.ai/', category: 'video', tag: '🖼️ Image-to-Video, No Signup', free: 'Unlimited', noSignup: true, unlimited: true, trending: true },
  { id: 'gizai', name: 'Giz AI', url: 'https://www.giz.ai/ai-video-generator', category: 'video', tag: '👤 Face Swap, No Reg', free: 'Unlimited', noSignup: true, unlimited: true, trending: true },
  { id: 'dreamlux', name: 'Dreamlux', url: 'https://dreamlux.ai/', category: 'video', tag: '✨ No Watermark, Unlimited', free: 'Free Online', noSignup: true, unlimited: true, trending: true },
  { id: 'metaai', name: 'Meta AI', url: 'https://www.meta.ai/', category: 'video', tag: '🤖 Animate/Restyle', free: 'Free', unlimited: true },
  { id: 'vibess', name: 'Vibess', url: 'https://www.vibess.app/hu/features/ai-video-generator-free-no-watermark', category: 'video', tag: '🎬 HD/4K, Commercial Use', free: 'Free Unlimited', unlimited: true },
  { id: 'grok', name: 'Grok', url: 'https://x.com/grok', category: 'video', tag: '🚀 Free Video/Image on X', free: 'Unlimited', unlimited: true },
  { id: 'veed', name: 'VEED', url: 'https://www.veed.io/tools/ai-video', category: 'video', tag: '🎥 Veo/Kling Models', free: 'Free Trial' },
  { id: 'leonardoveo', name: 'Leonardo Veo', url: 'https://leonardo.ai/veo-3/', category: 'video', tag: '🎥 Daily Tokens', free: 'Daily Free', trending: true },
  { id: 'pictory', name: 'Pictory', url: 'https://www.pictory.ai/', category: 'video', tag: '📝 Script-to-Video', free: 'Free First Round' },
  { id: 'runway', name: 'Runway ML', url: 'https://runwayml.com/', category: 'video', tag: '🎬 Advanced AI Editing', free: 'Free Credits', skillLevel: 'pro', trending: true },
  { id: 'capcut', name: 'CapCut', url: 'https://www.capcut.com/', category: 'video', tag: '📱 No Watermark, Social', free: 'Unlimited', unlimited: true, skillLevel: 'beginner', trending: true },
  { id: 'canvavid', name: 'Canva Video', url: 'https://www.canva.com/', category: 'video', tag: '🎨 No Watermark, Integrated', free: 'Free Tier', skillLevel: 'beginner' },
  { id: 'heygen', name: 'HeyGen', url: 'https://www.heygen.com/', category: 'video', tag: '👤 AI Avatars', free: 'Free 3 Videos' },
  { id: 'flexclip', name: 'FlexClip', url: 'https://www.flexclip.com/', category: 'video', tag: '🎥 Free 1080p', free: 'Unlimited', unlimited: true },
  { id: 'easemate', name: 'EaseMate', url: 'https://www.easemate.ai/ai-video-generator', category: 'video', tag: '🖼️ Text/Image-to-Video', free: 'Free Credits', unlimited: true },
  { id: 'kapwing', name: 'Kapwing', url: 'https://www.kapwing.com/ai-video-generator', category: 'video', tag: '📹 Unlimited Shorts', free: 'Free Tier', skillLevel: 'beginner' },
  { id: 'did', name: 'D-ID', url: 'https://www.d-id.com/creative-reality-studio/', category: 'video', tag: '🎭 Talking Heads', free: 'Free Unlimited', unlimited: true },
  { id: 'synthesia', name: 'Synthesia', url: 'https://www.synthesia.io/', category: 'video', tag: '👤 AI Avatars, Free Trial', free: 'Free Trial' },
  { id: 'lumen5', name: 'Lumen5', url: 'https://lumen5.com/', category: 'video', tag: '📝 Script-to-Video', free: 'Free Trial' },
  { id: 'clipchamp', name: 'ClipChamp', url: 'https://clipchamp.com/', category: 'video', tag: '🖥️ Microsoft, Free', free: 'Unlimited', unlimited: true, skillLevel: 'beginner' },
  { id: 'davinci', name: 'DaVinci Resolve', url: 'https://www.blackmagicdesign.com/products/davinciresolve', category: 'video', tag: '🎬 Pro Desktop Free', free: '100% Free', skillLevel: 'pro' },
  { id: 'screenpal', name: 'ScreenPal', url: 'https://screenpal.com/video-editor', category: 'video', tag: '🖥️ Free Online Editor', free: 'Unlimited', unlimited: true },
  { id: 'invideo', name: 'InVideo', url: 'https://invideo.io/make/ai-video-editor', category: 'video', tag: '🤖 AI Editor', free: 'Unlimited', unlimited: true },
  { id: 'toolfkvid', name: 'ToolFK Video Editor', url: 'https://www.toolfk.com/tools/online-video-editor.html', category: 'video', tag: '✂️ Free Edit/Convert', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'jaiportalvid', name: 'JaiPortal Video', url: 'https://www.jaiportal.com/free/ai-video-generator', category: 'video', tag: '🎬 10 Free Credits', free: 'No Subscription' },
  { id: 'obs', name: 'OBS Studio', url: 'https://obsproject.com', category: 'video', tag: '📺 Record/Stream Free', free: '100% Free', skillLevel: 'pro' },

  // MUSIC GENERATION (17 tools)
  { id: 'suno', name: 'Suno', url: 'https://suno.com/', category: 'audio', tag: '🎤 Text-to-Song, Free', free: 'Unlimited', unlimited: true, trending: true, skillLevel: 'beginner' },
  { id: 'udio', name: 'Udio', url: 'https://www.udio.com/', category: 'audio', tag: '🎵 Hi-Quality Music', free: 'Free Tier', trending: true },
  { id: 'riffusion', name: 'Riffusion', url: 'https://www.riffusion.com/', category: 'audio', tag: '🎸 Riff Generator', free: 'Unlimited', unlimited: true },
  { id: 'googlemusicfx', name: 'Google MusicFX', url: 'https://labs.google/fx/tools/music-fx', category: 'audio', tag: '🌟 Google Labs Free', free: 'Unlimited', unlimited: true },
  { id: 'remusic', name: 'ReMusic', url: 'https://remusic.ai/ai-music-generator', category: 'audio', tag: '🎵 AI Music Unlimited', free: 'Unlimited', unlimited: true },
  { id: 'aimusicgen', name: 'AIMusicGen', url: 'https://aimusicgen.ai/', category: 'audio', tag: '🎼 Text-to-Song, No Signup', free: 'Free', noSignup: true },
  { id: 'easymusic', name: 'EasyMusic', url: 'https://easymusic.ai/', category: 'audio', tag: '🎸 Simple Gen, Unlimited', free: 'Unlimited', unlimited: true, skillLevel: 'beginner' },
  { id: 'musicmuse', name: 'MusicMuse', url: 'https://www.musicmuse.ai/', category: 'audio', tag: '🎶 Creative Tracks', free: 'Unlimited', unlimited: true },
  { id: 'tadai', name: 'Tad AI', url: 'https://tad.ai/', category: 'audio', tag: '🎹 AI Composer', free: 'Free' },
  { id: 'aimusic', name: 'AIMusic.so', url: 'https://aimusic.so/', category: 'audio', tag: '🎵 Short Clips Unlimited', free: 'Unlimited', unlimited: true },
  { id: 'musichero', name: 'MusicHero', url: 'https://musichero.ai/', category: 'audio', tag: '🦸 Hero-Style Music', free: 'Free' },
  { id: 'mubert', name: 'Mubert', url: 'https://mubert.com/', category: 'audio', tag: '🤖 Text-to-Music', free: 'Free Unlimited', unlimited: true, trending: true },
  { id: 'melodycraft', name: 'MelodyCraft', url: 'https://melodycraft.ai/', category: 'audio', tag: '🎼 Melody Builder', free: 'Free' },
  { id: 'musicgenerator', name: 'MusicGeneratorAI', url: 'https://musicgeneratorai.com/', category: 'audio', tag: '🎵 General Unlimited', free: 'Unlimited', unlimited: true },
  { id: 'vidnozmusic', name: 'Vidnoz Music', url: 'https://www.vidnoz.com/ai-music.html', category: 'audio', tag: '🎵 AI Music Free', free: 'Free' },
  { id: 'brev', name: 'Brev', url: 'https://brev.ai/', category: 'audio', tag: '🎸 Short Tracks', free: 'Unlimited', unlimited: true },
  { id: 'audacity', name: 'Audacity', url: 'https://audacityteam.org', category: 'audio', tag: '🔊 Edit Audio Desktop', free: '100% Free', skillLevel: 'pro' },

  // TTS / VOICE (6 tools)
  { id: 'elevenlabs', name: 'ElevenLabs', url: 'https://elevenlabs.io/', category: 'tts', tag: '🎙️ Voice Cloning', free: 'Free Unlimited Shorts', unlimited: true, trending: true },
  { id: 'toolfktts', name: 'ToolFK TTS', url: 'https://www.toolfk.com/tools/ai-text-to-speech.html', category: 'tts', tag: '🗣️ Natural Voice, No Signup', free: 'Unlimited', noSignup: true, unlimited: true, skillLevel: 'beginner' },
  { id: 'naturalreaders', name: 'NaturalReaders', url: 'https://www.naturalreaders.com/online/', category: 'tts', tag: '📖 Free TTS Online', free: 'Unlimited Text', unlimited: true, skillLevel: 'beginner' },
  { id: 'playht', name: 'Play.ht', url: 'https://play.ht/', category: 'tts', tag: '🎵 Text-to-Audio', free: 'Free Unlimited', unlimited: true },
  { id: 'murfai', name: 'Murf AI', url: 'https://murf.ai/', category: 'tts', tag: '🎙️ Professional TTS', free: 'Free Credits' },
  { id: 'speechify', name: 'Speechify', url: 'https://www.speechify.com/', category: 'tts', tag: '⚡ Speed Control', free: 'Unlimited', unlimited: true, skillLevel: 'beginner' },

  // WRITING / TEXT (9 tools)
  { id: 'toolfktextgen', name: 'ToolFK Text Gen', url: 'https://www.toolfk.com/tools/online-text-generator.html', category: 'writing', tag: '✍️ AI Content, No Signup', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'toolfktexteditor', name: 'ToolFK Text Editor', url: 'https://www.toolfk.com/tools/online-text-editor.html', category: 'writing', tag: '✏️ Edit/Convert, No Signup', free: 'Unlimited', noSignup: true, unlimited: true },
  { id: 'writesonic', name: 'Writesonic', url: 'https://writesonic.com/', category: 'writing', tag: '📝 Brand Tone AI', free: 'Unlimited Words', skillLevel: 'beginner' },
  { id: 'rytr', name: 'Rytr', url: 'https://www.rytr.me/', category: 'writing', tag: '✍️ Unlimited Free Words', free: 'Unlimited', unlimited: true, skillLevel: 'beginner' },
  { id: 'quillbot', name: 'Quillbot', url: 'https://www.quillbot.com/', category: 'writing', tag: '🔄 Paraphraser Unlimited', free: 'Unlimited Words', unlimited: true, skillLevel: 'beginner' },
  { id: 'grammarly', name: 'Grammarly', url: 'https://www.grammarly.com/', category: 'writing', tag: '✅ Grammar Check', free: 'Free Tier', skillLevel: 'beginner' },
  { id: 'reverso', name: 'Reverso', url: 'https://www.reverso.net/text-translation', category: 'writing', tag: '🌐 Translation+Edit', free: 'Free Unlimited', unlimited: true },
  { id: 'wordtune', name: 'Wordtune', url: 'https://www.wordtune.com/', category: 'writing', tag: '✍️ Free Rewrite', free: 'Unlimited', unlimited: true },
  { id: 'paraphraser', name: 'Paraphraser.io', url: 'https://www.paraphraser.io/', category: 'writing', tag: '🔄 Unlimited Paraphrase', free: 'Unlimited', unlimited: true, skillLevel: 'beginner' },

  // AI CHAT (6 tools)
  { id: 'groq', name: 'Groq Llama3', url: 'https://console.groq.com', category: 'chat', tag: '⚡ Fastest Free AI', free: '100% Free', trending: true, skillLevel: 'beginner' },
  { id: 'deepseek', name: 'DeepSeek', url: 'https://platform.deepseek.com', category: 'chat', tag: '🧠 Very Generous', free: 'Free Tier', trending: true },
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chat.openai.com/', category: 'chat', tag: '🤖 OpenAI', free: 'Free Tier', skillLevel: 'beginner' },
  { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com/', category: 'chat', tag: '🌟 Google, Unlimited', free: 'Free Account', unlimited: true },
  { id: 'claude', name: 'Claude AI', url: 'https://console.anthropic.com', category: 'chat', tag: '🤖 Anthropic', free: 'Free Tier', skillLevel: 'beginner' },
  { id: 'perplexity', name: 'Perplexity', url: 'https://www.perplexity.ai/', category: 'chat', tag: '🔍 AI Search+Gen', free: 'Free Unlimited', unlimited: true, skillLevel: 'beginner' },

  // CODE (6 tools)
  { id: 'bolt', name: 'Bolt.new', url: 'https://bolt.new', category: 'code', tag: '⚡ AI Fullstack', free: 'Free Tier', trending: true },
  { id: 'v0', name: 'v0 by Vercel', url: 'https://v0.dev', category: 'code', tag: '🤖 AI UI Builder', free: 'Free Tier', trending: true },
  { id: 'codesandbox', name: 'CodeSandbox', url: 'https://codesandbox.io', category: 'code', tag: '⚡ Online IDE', free: 'Free Tier', trending: true },
  { id: 'replit', name: 'Replit', url: 'https://replit.com', category: 'code', tag: '🚀 Online IDE', free: 'Free Tier', skillLevel: 'beginner' },
  { id: 'github', name: 'GitHub', url: 'https://github.com', category: 'code', tag: '💻 Code Host', free: 'Free', skillLevel: 'pro' },
  { id: 'stackoverflow', name: 'Stack Overflow', url: 'https://stackoverflow.com', category: 'code', tag: '❓ Q&A', free: 'Free' },

  // DESIGN (4 tools)
  { id: 'canva', name: 'Canva', url: 'https://canva.com', category: 'design', tag: '🎨 Design All-in-One', free: 'Free Tier', skillLevel: 'beginner', trending: true },
  { id: 'figma', name: 'Figma', url: 'https://figma.com', category: 'design', tag: '🖼️ Prototyping', free: 'Free Tier', skillLevel: 'pro' },
  { id: 'penpot', name: 'Penpot', url: 'https://penpot.app', category: 'design', tag: '🎨 Open Source Free', free: '100% Free' },
  { id: 'looka', name: 'Looka', url: 'https://looka.com', category: 'design', tag: '🔤 Logo AI', free: 'Free Preview' },

  // PRODUCTIVITY (4 tools)
  { id: 'googledrive', name: 'Google Drive', url: 'https://drive.google.com', category: 'productivity', tag: '☁️ 15GB Storage', free: '15GB Free', skillLevel: 'beginner' },
  { id: 'googledocs', name: 'Google Docs', url: 'https://docs.google.com', category: 'productivity', tag: '📝 Writing', free: 'Free', skillLevel: 'beginner' },
  { id: 'notion', name: 'Notion', url: 'https://notion.so', category: 'productivity', tag: '📋 Notes+DB', free: 'Free Tier' },
  { id: 'trello', name: 'Trello', url: 'https://trello.com', category: 'productivity', tag: '📌 Task Board', free: 'Free Tier', skillLevel: 'beginner' },

  // LEARNING (3 tools)
  { id: 'freecodecamp', name: 'freeCodeCamp', url: 'https://freecodecamp.org', category: 'learning', tag: '💻 Free Coding', free: '100% Free', skillLevel: 'beginner' },
  { id: 'khan', name: 'Khan Academy', url: 'https://khanacademy.org', category: 'learning', tag: '🎯 Free Learning', free: '100% Free', skillLevel: 'beginner' },
  { id: 'mdn', name: 'MDN Web Docs', url: 'https://developer.mozilla.org', category: 'learning', tag: '📚 Web Docs', free: 'Free', skillLevel: 'pro' },
]

export const CATEGORIES = [
  'all','image','image-edit','upscale','video','audio','tts',
  'visual','writing','chat','code','design','productivity','learning'
]

export const CATEGORY_LABELS: Record<string, string> = {
  all: '🔍 All', image: '🎨 Image Gen', 'image-edit': '✂️ Image Edit',
  upscale: '⬆️ Upscale', video: '🎬 Video', audio: '🎵 Music',
  tts: '🗣️ Voice TTS', visual: '🎭 Art Style', writing: '✍️ Writing',
  chat: '🤖 AI Chat', code: '💻 Code', design: '✏️ Design',
  productivity: '📋 Tools', learning: '📚 Learn',
}

export function filterTools(category: string, query: string = ''): Tool[] {
  let results = category === 'all' ? TOOLS : TOOLS.filter(t => t.category === category)
  if (query) {
    const q = query.toLowerCase()
    results = results.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.tag.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    )
  }
  return results
}

export function getTrendingTools(): Tool[] {
  return TOOLS.filter(t => t.trending).slice(0, 8)
}

export function getNoSignupTools(): Tool[] {
  return TOOLS.filter(t => t.noSignup).slice(0, 12)
}