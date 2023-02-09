htmx.defineExtension('image-resize', {
    onEvent: function (name, evt) {
        if (name === "htmx:beforeRequest") {
			const elt = evt.detail.elt;
			if (elt.files.length == 0) return false;
			const params = elt.getAttribute("hx-image-resize").split(" ");
			const maxWidth = parseInt(params[0], 10);
			const maxHeight = params.length > 1 ? parseInt(params[1], 10) : maxWidth;
			const quality = params.length > 2 ? parseFloat(params[2], 10) : -1;
			const xhr = evt.detail.xhr;
			const imageFile = elt.files[0];
			const reader = new FileReader();
			reader.onload = function(e) {
				let img = document.createElement("img");
				img.onload = function () {
					let width = img.width;
					let height = img.height;
					if (width <= maxWidth && height <= maxHeight) {
						const fd=new FormData();
						fd.append(elt.name, imageFile, imageFile.name);
						htmx.trigger(elt, "htmx:xhr:loadstart");
						xhr.onprogress = function(e) {
							htmx.trigger(elt, "htmx:xhr:progress", {loaded:e.loaded, total:e.total});
						}
						xhr.send(fd);
					} else {
						if (width > height) {
							if (width > maxWidth) {
								height = height * (maxWidth / width);
								width = maxWidth;
							}
						} else {
							if (height > maxHeight) {
								width = width * (maxHeight / height);
								height = maxHeight;
							}
						}
						const canvas = document.createElement("canvas");
						canvas.width = width;
						canvas.height = height;
						const ctx = canvas.getContext("2d");
						ctx.drawImage(img, 0, 0, width, height);
						canvas.toBlob(function(file) {
							const fd=new FormData();
							fd.append(elt.name, file, imageFile.name);
							htmx.trigger(elt, "htmx:xhr:loadstart");
							xhr.onprogress = function(e) {
								htmx.trigger(elt, "htmx:xhr:progress", {loaded:e.loaded, total:e.total});
							}
							xhr.send(fd);
						}, imageFile.type, quality);
					}
				}
				img.src = e.target.result;
			}
			reader.readAsDataURL(imageFile);
			return false;
        }
    }
});
