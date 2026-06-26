(async function(){
  var target = document.getElementById('status');
  function msg(text){ if(target) target.textContent = text; }
  function esc(text){ return String(text).replace(/[<>&]/g,function(c){ return {'<':'&lt;','>':'&gt;','&':'&amp;'}[c]; }); }
  try {
    msg('Downloading app payload.');
    var files = ['app/app.gz.b64.00.txt','app/app.gz.b64.01.txt'];
    var b64 = '';
    for (var i = 0; i < files.length; i++) {
      var response = await fetch(files[i], {cache:'no-store'});
      if (!response.ok) throw new Error('Could not load '+files[i]+' HTTP '+response.status);
      b64 += (await response.text()).trim();
    }
    msg('Preparing app.');
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var j = 0; j < bin.length; j++) bytes[j] = bin.charCodeAt(j);
    if (!('DecompressionStream' in window)) throw new Error('This browser cannot decompress the app payload.');
    var stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    var html = await new Response(stream).text();
    msg('Launching app.');
    var url = URL.createObjectURL(new Blob([html], {type:'text/html'}));
    location.replace(url);
  } catch (error) {
    document.body.innerHTML = '<div class="boot"><div class="card"><h1>PromptPose failed to load</h1><p>'+esc(error && error.message ? error.message : error)+'</p></div></div>';
  }
}());
