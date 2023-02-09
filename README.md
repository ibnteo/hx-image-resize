# HTMX Image Resize

The library for [htmx](https://htmx.org/) allows you to resize the image before sending it to the server, the [hyperscript](https://hyperscript.org/) library is used for event processing.

The usual file upload is described in the HTMX examples: https://htmx.org/examples/file-upload/

This is how it will look using this library, being embedded in a regular form, without `encoding="multipart/form-data"`:

```
<script src="htmx.min.js"/>
<script src="hyperscript.min.js"/>
<script src="hx-image-resize.js"/>

<div id="upload-result"></div>
<div id="upload-error"></div>
<progress id="upload-progress" value="0" max="100"/>

<input type="file" name="image"
	hx-target=>"#upload-result"
	hx-params=>"image"
	hx-post="/upload"
	hx-encoding="multipart/form-data"
	hx-trigger="change"
	hx-ext="image-resize"
	hx-image-resize=>"700 300"
	_="	on htmx:xhr:loadstart hide #upload-error show #upload-progress
		on htmx:xhr:progress(loaded, total) if total set #upload-progress.value to (loaded/total)*100 end
		on htmx:afterRequest hide #upload-progress
		on htmx:error(errorInfo) show #upload-error set #upload-error.innerText to errorInfo.xhr.response
	"
/>
```
