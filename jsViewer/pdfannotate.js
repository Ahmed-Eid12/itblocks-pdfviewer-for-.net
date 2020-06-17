/**
 * PDFAnnotate v1.0.0
 * Author: Ravisha Heshan
 */

var left;
var top;
var PDFAnnotate = function (container_id, url, options = {}) {
	this.number_of_pages = 0;
	this.pages_rendered = 0;
	this.active_tool = 1; // 1 - Free hand, 2 - Text, 3 - Arrow, 4 - Rectangle, 5 - signature
	this.fabricObjects = [];
	this.fabricObjectsData = [];
	this.color = '#212121';
	this.borderColor = '#000000';
	this.borderSize = 1;
	this.font_size = 16;
	this.active_canvas = 0;
	this.container_id = container_id;
	this.url = url;
	var inst = this;

	var loadingTask = PDFJS.getDocument(this.url);
	loadingTask.promise.then(function (pdf) {
		var scale = 1.3;
		inst.number_of_pages = pdf.pdfInfo.numPages;
		$('#no-pages').html(pdf.pdfInfo.numPages);

		for (var i = 1; i <= pdf.pdfInfo.numPages; i++) {
			pdf.getPage(i).then(function (page) {
				var viewport = page.getViewport(scale);
				var canvas = document.createElement('canvas');
				document.getElementById(inst.container_id).appendChild(canvas);
				canvas.className = 'pdf-canvas';
				canvas.height = viewport.height;
				canvas.width = viewport.width;
				context = canvas.getContext('2d');

				var renderContext = {
					canvasContext: context,
					viewport: viewport
				};
				var renderTask = page.render(renderContext);
				renderTask.then(function () {
					$('.pdf-canvas').each(function (index, el) {
						$(el).attr('id', 'page-' + (index + 1) + '-canvas');
					});
					inst.pages_rendered++;
					if (inst.pages_rendered == inst.number_of_pages) inst.initFabric();
				});
			});
		}
	}, function (reason) {
		$('#error-alert').addClass('fade in show');
	});

	this.initFabric = function () {
		var inst = this;
		$('#' + inst.container_id + ' canvas').each(function (index, el) {
			var background = el.toDataURL("image/jpeg"); // image/png
			var fabricObj = new fabric.Canvas(el.id, {
				freeDrawingBrush: {
					width: 1,
					color: inst.color
				}
			});
			inst.fabricObjects.push(fabricObj);
			if (typeof options.onPageUpdated == 'function') {
				fabricObj.on('object:added', function () {
					var oldValue = Object.assign({}, inst.fabricObjectsData[index]);
					inst.fabricObjectsData[index] = fabricObj.toJSON()
					options.onPageUpdated(index + 1, oldValue, inst.fabricObjectsData[index])
				})
			}
			fabricObj.setBackgroundImage(background, fabricObj.renderAll.bind(fabricObj));
			$(fabricObj.upperCanvasEl).click(function (event) {
				inst.active_canvas = index;
				inst.fabricClickHandler(event, fabricObj);

				left = fabricObj.upperCanvasEl.getBoundingClientRect().left;
				top = fabricObj.upperCanvasEl.getBoundingClientRect().top;

			});
			fabricObj.on('after:render', function () {
				inst.fabricObjectsData[index] = fabricObj.toJSON()
				fabricObj.off('after:render')
			})
		});
		var div = document.querySelectorAll('div.canvas-container');
		var counter = 1;
//		var id;
//		var divInput = $('#div-id');
		for (var i = 0; i < div.length; i++) {
			div[i].setAttribute('id', 'idNO-' + (counter + i))
		}

		for (var i = 0; i < div.length; i++) {
			div[i].addEventListener('mouseup', function () {
//				id = div[i].id;
//				divInput.val(id);
//				$('#img-id').val('');
			})
		}
		// $('#no-pages').html(div.length);
		$('#pageNO').val(1);

		// page number scroll to get page number ... 
		$(window).scroll(function () {
			for (var i = 1; i < div.length; i++) {
				var hT = $('#idNO-' + i).offset().top,
					hH = $('#idNO-' + i).outerHeight(),
					wH = $(window).height(),
					wS = $(this).scrollTop();
				if (wS >= ((hT + hH) - (wH-500))) {
					$('#pageNO').val(i +1);
				}
				if (wS == 0) {
					$('#pageNO').val(1);
				}
			}
		});

		var originWidth_ = $('.canvas-container').width();
		var originHeight_ = $('.canvas-container').height();
		$('#origin-width').val(originWidth_);
		$('#origin-height').val(originHeight_);

	}
//	$('#color-id').val('red');
//	var txtColor = document.getElementsByClassName('color');
//	for (var i = 0; i < txtColor.length; i++) {
//		txtColor[i].addEventListener('click', function () {
//			var valueColor = txtColor[i].value;
//			$('#color-id').val(valueColor);
//		})
//	}

	var documentHeight = 100;
	var documentWidth = 100;
	// zoom in / out of document 
	$("#zoom-in").click(function () {
		var _width;
		var _height;
		_width = ($('.canvas-container').width() + documentWidth);
		_height = ($('.canvas-container').height() + documentHeight);
		var divContent = $('.canvas-container');
		divContent.css({
			'width': _width,
			'height': _height
		});
		var canvas  = $('canvas');
		canvas.css({
			'width': ($('canvas').width() + documentWidth),
			'height': ($('canvas').height() + documentHeight)
		});
		$("#zoom-out").prop('disabled' , false);
		if(_height == 1829) {
			$("#zoom-in").prop('disabled' , true);
		}
    });

    
    $("#zoom-out").click(function () {
		var _width;
		var _height;
		_width = ($('.canvas-container').width() - documentWidth);
		_height = ($('.canvas-container').height() - documentHeight);
		var divContent = $('.canvas-container');
		divContent.css({
			'width': _width,
			'height': _height
		});
		var canvas  = $('canvas');
		canvas.css({
			'width': ($('canvas').width() - documentWidth),
			'height': ($('canvas').height() - documentHeight)
		});
		$("#zoom-in").prop('disabled' , false);
		if(_height == 1029) {
			$("#zoom-out").prop('disabled' , true);
		}
	});
	
	this.fabricClickHandler = function (event, fabricObj) {
		var inst = this;
		var text;
		if (inst.active_tool == 2) {
			text = new fabric.IText('Tap and Type', {
				left: event.clientX - fabricObj.upperCanvasEl.getBoundingClientRect().left,
				top: event.clientY - fabricObj.upperCanvasEl.getBoundingClientRect().top,
				fill: inst.color,
				fontSize: inst.font_size,
				selectable: true
			});

			fabricObj.add(text);
			inst.active_tool = 0;

			// var txtSize = document.getElementById('font-size');
			// txtSize.addEventListener('change', function () {
			// 	var val = txtSize.value;
			// 	text.fontSize = val;
			// 	fabricObj.renderAll();
			// }, false);

			// var txtColor = document.getElementsByClassName('color');
			// for (let i = 0; i < txtColor.length; i++) {
			// 	txtColor[i].addEventListener('click', function () {
			// 		var val = txtColor[i].value;
			// 		text.set('fill', val);
			// 		fabricObj.renderAll();
			// 	})
			// }
			// txtColor.addEventListener('click', function(){
			// 	var val = txtColor.value;
			// 	text.set('fill', val);
			// 	fabricObj.renderAll();
			// }, false);

		}

		// click handler for rectangle ...
		if (inst.active_tool == 4) {
			var rect = new fabric.Rect({
				left: event.clientX - fabricObj.upperCanvasEl.getBoundingClientRect().left,
				top: event.clientY - fabricObj.upperCanvasEl.getBoundingClientRect().top,
				width: 100,
				height: 100,
				fill: inst.color,
				stroke: inst.borderColor,
				borderColor: inst.color,
				strokeSize: 0,
			});
			fabricObj.add(rect);
			inst.active_tool = 0;

		}
		
		// dark rect
		if (inst.active_tool == 5) {
			var rectDark = new fabric.Rect({
				left: event.clientX - fabricObj.upperCanvasEl.getBoundingClientRect().left,
				top: event.clientY - fabricObj.upperCanvasEl.getBoundingClientRect().top,
				width: 100,
				height: 100,
				fill: inst.color,
//				stroke: inst.borderColor,
//				borderColor: inst.color,
				//strokeSize: 0,
			});
			fabricObj.add(rectDark);
			inst.active_tool = 0;

		}
		
		// click handler for image ...
		if (inst.active_tool == 6) {
			var imgURL = './images/s1.png';    // ./images/s1.png if on port
			var signImg = new Image();
			signImg.onload = function (img) {
				var sign = new fabric.Image(signImg, {
					left: event.clientX - fabricObj.upperCanvasEl.getBoundingClientRect().left,
					top: event.clientY - fabricObj.upperCanvasEl.getBoundingClientRect().top,
				});
				fabricObj.add(sign);
				inst.active_tool = 0;
			};
			signImg.src = imgURL;
		}
		// upload image from my computer ...
		if (inst.active_tool == 7) {
			var imageUploaded = document.querySelector('input[id="inputImage"]');
			var signImg;
			if (imageUploaded.files && imageUploaded.files[0]) {
				signImg = new Image(); // $('img')[0]
				signImg.onload = function (img) {
					var sign = new fabric.Image(signImg)
					
					sign.scale(0.2).set({
						left: event.clientX - fabricObj.upperCanvasEl.getBoundingClientRect().left,
						top: event.clientY - fabricObj.upperCanvasEl.getBoundingClientRect().top,
					});
					
					fabricObj.add(sign);
				}
				signImg.src = URL.createObjectURL(imageUploaded.files[0]);
			}

			$('#inputImage').val('');
		}
	}
}



PDFAnnotate.prototype.enableSelector = function () {
	var inst = this;
	inst.active_tool = 0;
	if (inst.fabricObjects.length > 0) {
		$.each(inst.fabricObjects, function (index, fabricObj) {
			fabricObj.isDrawingMode = false;
		});
	}
}

PDFAnnotate.prototype.enablePencil = function () {
	var inst = this;
	inst.active_tool = 1;
	if (inst.fabricObjects.length > 0) {
		$.each(inst.fabricObjects, function (index, fabricObj) {
			fabricObj.isDrawingMode = true;
		});
	}
}

PDFAnnotate.prototype.enableAddText = function () {
	var inst = this;
	inst.active_tool = 2;
	if (inst.fabricObjects.length > 0) {
		$.each(inst.fabricObjects, function (index, fabricObj) {
			fabricObj.isDrawingMode = false;
		});
	}
}

PDFAnnotate.prototype.addSignatureImage = function () {
	var inst = this;
	inst.active_tool = 6;
	if (inst.fabricObjects.length > 0) {
		$.each(inst.fabricObjects, function (index, fabricObj) {
			fabricObj.isDrawingMode = false;
		});
	}
}

PDFAnnotate.prototype.enableRectangle = function (event) {
	var inst = this;
	var fabricObj = inst.fabricObjects[inst.active_canvas];
	inst.active_tool = 4;
	if (inst.fabricObjects.length > 0) {
		$.each(inst.fabricObjects, function (index, fabricObj) {
			fabricObj.isDrawingMode = false;
		});
	}
}
// dark rectangle ...
PDFAnnotate.prototype.enableRectangleDark = function () {
	var inst = this;
	var fabricObj = inst.fabricObjects[inst.active_canvas];
	inst.active_tool = 5;
	if (inst.fabricObjects.length > 0) {
		$.each(inst.fabricObjects, function (index, fabricObj) {
			fabricObj.isDrawingMode = false;
		});
	}
}

PDFAnnotate.prototype.enableAddArrow = function () {
	var inst = this;
	inst.active_tool = 3;
	if (inst.fabricObjects.length > 0) {
		$.each(inst.fabricObjects, function (index, fabricObj) {
			fabricObj.isDrawingMode = false;
			new Arrow(fabricObj, inst.color, function () {
				inst.active_tool = 0;
			});
		});
	}
}

PDFAnnotate.prototype.deleteSelectedObject = function () {
	var inst = this;
	var activeObject = inst.fabricObjects[inst.active_canvas].getActiveObject();
	if (activeObject) {
		if (confirm('Are you sure ?')) inst.fabricObjects[inst.active_canvas].remove(activeObject);
	}
	var img_id = $('#img-id').val();
	if (img_id) {
		if (confirm('Are you sure you want to remove signature ?')) $('#' + img_id).remove();
		$('#img-id').val('');
	}
}


function GetXmlHttpObject() {
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		return new XMLHttpRequest();
	}
	if (window.ActiveXObject) {
		// code for IE6, IE5
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
	return null;
}
// new adding save ....
PDFAnnotate.prototype.savePdf = function () {
	var canvas = $('canvas');
		canvas.height($('#origin-height').val());
		canvas.width($('#origin-width').val());

	var div_canvas_container = $('.canvas-container');
		div_canvas_container.height($('#origin-height').val());
		div_canvas_container.width($('#origin-width').val());
	
	var namePDF;
	var inst = this;
//	namePDF = window.prompt('name of pdf file');
//
//	if (namePDF) {
		var doc = new jsPDF();
		$.each(inst.fabricObjects, function (index, fabricObj) {
			if (index != 0) {
				doc.addPage();
				doc.setPage(index + 1);
			}
			doc.addImage(fabricObj.toDataURL({
				format: 'jpeg',
				quality: 0.9
			}), 'JPEG', 0, 0);
		});
		var base64_btoa = btoa(doc.output());
		
		var myxmlhttpobj = GetXmlHttpObject();
        var url = window.location.href;
        var ip = url.split("/")[2];
        var url = "http://" + ip + "/cmsBDC/ITBViewerServlet";
        
        var imageDataContent= "imageBytes=" + base64_btoa ;
        
        var params = imageDataContent +"&txt_corrID=" +document.getElementById('update_corrIdDoc').value
        + "&txt_corrInboxID=" + document.getElementById('update_corrInboxIdDoc').value
        +"&txt_operation=UPDATE" + "&txt_docGUID=" + document.getElementById('docGUID').value
        + "&txt_DocID=" + document.getElementById('update_DocID').value 
        + "&txt_DocVsID=" + document.getElementById('update_DocVsID').value 
        + "&txt_VsID=" + document.getElementById('update_VsID').value
        + "&documentType=" + document.getElementById('update_docType').value
        + "&type=" + document.getElementById('update_Type').value
        + "&fileId=" + document.getElementById('update_fileIdDoc').value
        + "&stringType_save=pdf"
           myxmlhttpobj.open("POST",url,true); 
            
            myxmlhttpobj.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");

            myxmlhttpobj.onreadystatechange = function() {// Call a function when
                                                                                                                                                                                                                        // the state changes.
    
                        if(myxmlhttpobj.readyState == 4 && myxmlhttpobj.status == 200) {

                                       // alert(myxmlhttpobj.responseText);
                                                        $('#Tprogress').addClass('hidden');

                                       if (myxmlhttpobj.responseText =="Uploaded") {
                                                       alert(" تم حفظ المحتوى بنجاح ");
                                                       parent.$.fancybox.close();
                                                       var attachFilesAdd = window.parent.document.getElementById("closePdfAnnotationBtn");
                                    	    		   attachFilesAdd.click();

                                                        }
                                       else
                                       {
                                                       alert(" !! فشل في عملية الحفظ");
                                                     
                                        }
                        }

            };

            myxmlhttpobj.send(params);
		
}

PDFAnnotate.prototype.printPDF = function (elementId) {
	var canvas = $('canvas');
	canvas.height($('#origin-height').val());
	canvas.width($('#origin-width').val());

	var div_canvas_container = $('.canvas-container');
	div_canvas_container.height($('#origin-height').val());
	div_canvas_container.width($('#origin-width').val());
	
	var inst = this;
		var doc = new jsPDF();
		$.each(inst.fabricObjects, function (index, fabricObj) {
			if (index != 0) {
				doc.addPage();
				doc.setPage(index + 1);
			}
			doc.addImage(fabricObj.toDataURL({
				format: 'jpeg',
				quality: 0.9
			}), 'JPEG', 0, 0);
		});
		var base64_btoa = btoa(doc.output());
		printJS({printable: base64_btoa, type: 'pdf', base64: true});
}

PDFAnnotate.prototype.setBrushSize = function (size) {
	var inst = this;
	$.each(inst.fabricObjects, function (index, fabricObj) {
		fabricObj.freeDrawingBrush.width = size;
	});
}

PDFAnnotate.prototype.setColor = function (color) {
	var inst = this;
	inst.color = color;
	$.each(inst.fabricObjects, function (index, fabricObj) {
		fabricObj.freeDrawingBrush.color = color;
	});
}

PDFAnnotate.prototype.setBorderColor = function (color) {
	var inst = this;
	inst.borderColor = color;
}

PDFAnnotate.prototype.setFontSize = function (size) {
	this.font_size = size;
}

PDFAnnotate.prototype.setBorderSize = function (size) {
	this.borderSize = size;
}

PDFAnnotate.prototype.clearActivePage = function () {
	var inst = this;
	var fabricObj = inst.fabricObjects[inst.active_canvas];
	var bg = fabricObj.backgroundImage;
	if (confirm('Are you sure?')) {
		fabricObj.clear();
		fabricObj.setBackgroundImage(bg, fabricObj.renderAll.bind(fabricObj));
	}
}

PDFAnnotate.prototype.serializePdf = function () {
	var inst = this;
	return JSON.stringify(inst.fabricObjects, null, 4);
}



PDFAnnotate.prototype.loadFromJSON = function (jsonData) {
	var inst = this;
	$.each(inst.fabricObjects, function (index, fabricObj) {
		if (jsonData.length > index) {
			fabricObj.loadFromJSON(jsonData[index], function () {
				inst.fabricObjectsData[index] = fabricObj.toJSON()
			})
		}
	});
}

PDFAnnotate.prototype.uploadImage = function () {
	var inst = this;
	var fabricObj = inst.fabricObjects[inst.active_canvas];
	inst.active_tool = 7;
	if (inst.fabricObjects.length > 0) {
		$.each(inst.fabricObjects, function (index, fabricObj) {
			fabricObj.isDrawingMode = false;
		});
	}

}