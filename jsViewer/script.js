var pdf
function PDFViewer() {
	// Read File
	var selectedFile = document.getElementById("inputFile").files;
	// Check File is not Empty
	if (selectedFile.length > 0) {
		// Select the very first file from list
		var fileToLoad = selectedFile[0];
		// FileReader function for read the file.
		var fileReader = new FileReader();
		var base64;
		// Onload of file read the file content
		fileReader.onload = function(fileLoadedEvent) {
			base64 = fileLoadedEvent.target.result;
			// Print data in console
			console.log(base64);
			pdf = new PDFAnnotate('pdf-container', base64, {
				onPageUpdated : function(page, oldData, newData) {
					// console.log(page, oldData, newData);
				}
			});
		};
		// Convert data to base64
		fileReader.readAsDataURL(fileToLoad);
	}
}

function enableSelector(event) {
	event.preventDefault();
	var element = ($(event.target).hasClass('tool-button')) ? $(event.target)
			: $(event.target).parents('.tool-button').first();
	$('.tool-button.active').removeClass('active');
	$(element).addClass('active');
	pdf.enableSelector();
}

function enablePencil(event) {
	event.preventDefault();
	var element = ($(event.target).hasClass('tool-button')) ? $(event.target)
			: $(event.target).parents('.tool-button').first();
	$('.tool-button.active').removeClass('active');
	$(element).addClass('active');
	pdf.enablePencil();
}

function enableAddText(event) {
	event.preventDefault();
	var element = ($(event.target).hasClass('tool-button')) ? $(event.target)
			: $(event.target).parents('.tool-button').first();
	$('.tool-button.active').removeClass('active');
	$(element).addClass('active');
	pdf.enableAddText();
}

function enableAddArrow(event) {
	event.preventDefault();
	var element = ($(event.target).hasClass('tool-button')) ? $(event.target)
			: $(event.target).parents('.tool-button').first();
	$('.tool-button.active').removeClass('active');
	$(element).addClass('active');
	pdf.enableAddArrow();
}
// rectangle ( transparent )
function enableRectangle(event) {
	event.preventDefault();
	var element = ($(event.target).hasClass('tool-button')) ? $(event.target)
			: $(event.target).parents('.tool-button').first();
	$('.tool-button.active').removeClass('active');
	$(element).addClass('active');
	pdf.setColor('rgba(255, 0, 0, 0)');
	pdf.setBorderColor('#979C9C');
	pdf.enableRectangle();
}
// rectangle ( Dark )
function enableRectangleDark(event) {
	event.preventDefault();
	var element = ($(event.target).hasClass('tool-button')) ? $(event.target)
			: $(event.target).parents('.tool-button').first();
	$('.tool-button.active').removeClass('active');
	$(element).addClass('active');
//	pdf.setColor($('#color-id').val());
//	pdf.setBorderColor($('#color-id').val());
	pdf.enableRectangleDark();
}

// upload Image ...
function uploadImages() {
	pdf.uploadImage();
}

function deleteSelectedObject() {
	event.preventDefault();
	event.stopPropagation();
	pdf.deleteSelectedObject();
}

function savePDF() {
	if ($('#pdf-container').html() == '') {
		message('There is no content ,please upload PDF file', 4000);
	} else {
		// pdf.save1PDF();
		pdf.savePdf();
	}
}

function printPDF() {
	if ($('#pdf-container').html() == '') {
		message('There is no content ,please upload PDF file', 4000);
	} else {
		pdf.printPDF('pdf-container');
	}
}

function signature() {
	if ($('#pdf-container').html() == '') {
		var message = $('.message').css('opacity', '1');
		setTimeout(function() {
			message.css('opacity', '0');
		}, 3000);
	} else {
		$('#img-id').val('');
		// pdf.addSignatureImg();
		pdf.addSignatureImage();
	}
}

function clearPage() {
	pdf.clearActivePage();
}

// message
function message(message, timer) {
	var timerInterval
	Swal.fire({
		title : message,
		timer : timer,
		timerProgressBar : true,
		onBeforeOpen : function() {
			Swal.showLoading()
			timerInterval = setInterval(function() {
				var content = Swal.getContent()
			}, 100)
		},
		onClose : function() {
			clearInterval(timerInterval)
		}
	}).then(function(result) {
		/* Read more about handling dismissals below */
		if (result.dismiss === Swal.DismissReason.timer) {
			// console.log('I was closed by the timer')
		}
	})
}

function showPdfData() {
	var string = pdf.serializePdf();
	$('#dataModal .modal-body pre').first().text(string);
	PR.prettyPrint();
	$('#dataModal').modal('show');
}

function toScrollUp() {
	/* Scroll to top when arrow up clicked BEGIN */
	$('main').scroll(function() {
		var height = $('main').scrollTop();
		if (height > 100) {
			$('#back2Top').fadeIn();
		} else {
			$('#back2Top').fadeOut();
		}
	});
	$("#back2Top").click(function(event) {
		event.preventDefault();
		$(" main").animate({
			scrollTop : 0
		}, "slow");
		return false;

	});
}
/* Scroll to top when arrow up clicked END */

/**
 * number of pages
 */
function pageNO() {

	$("#pageNO").one(
			'blur',
			function() {
				var pageNumber = $("#pageNO").val();
				let
				div = document.querySelectorAll('div.canvas-container');
				if (pageNumber > div.length || pageNumber <= 0) {
					Swal.fire('Please, enter right page NO');
				} else {
					$(
							'<a href="#idNO-' + pageNumber + '" id="a-id-'
									+ pageNumber + '"></a>').appendTo(
							'div.canvas-container#idNO-' + pageNumber).css({
						"display" : "none"
					});
					$('div#pdf-container a[id="a-id-' + pageNumber + '"]').on(
							'click',
							function() {
								var target = $(this.hash);
								target = target.length ? target : $('[name='
										+ this.hash.substr(1) + ']');
								if (target.length) {
									$('html,body').animate({
										scrollTop : target.offset().top
									}, 1000);
									return false;
								}
							});
					$('#pdf-container a').click();
				}

				$('#pdf-container a').remove();
			});
}

/*
 * get file by Id for edit
 */
var pdf
function viewPDFContent() {
	var type = $('#update_Type').val();
	var vsid = $('#update_VsID').val();
	var searchDocGUID = $('#docGUID').val();
	$.ajax({
		url : propJSON.WEB_SERVICE_URL + '/getDocContentToViewer',
		type : 'POST',
		data : {
			userId : $('#USER_ID').val(),
			password : '',
			docGUID : searchDocGUID,
			vsid : vsid,
			type : type,
		},
		success : function(jsonTemplate) {
			if (jsonTemplate.status == true) {
				pdf = new PDFAnnotate('pdf-container', "data:application/pdf;base64,"+jsonTemplate.data.contentBase64, {
					onPageUpdated : function(page, oldData, newData) {
						// console.log(page, oldData, newData);
					}
				});
				$('.pageName').html(jsonTemplate.data.name);
//				$('.pageName').attr('aria-label',jsonTemplate.data.name);
				$('.pageName').attr('title', jsonTemplate.data.name);
			} else {
				popupMassageDanger(jsonTemplate.errorMessage);
				// ResourceMessageControl.getResourceMessage(jsonTemplate,
				// 'searchError');
			}
			$('#Tprogress').addClass('hidden');
		},
		error : function(xhr, textStatus, errorThrown) {
			alert($.i18n.prop('searchError'));
			// ResourceMessageControl.getErrorResourceMessage(xhr, '');
			$('#Tprogress').addClass('hidden');
		}
	});
};

$(function() {
	viewPDFContent()

	$('.color').click(function(e) {
		e.stopPropagation();
		$('.color.active').removeClass('active');
		$(this).addClass('active');
		$('.colors').removeClass('not-active');
		color = $(this).get(0).style.backgroundColor;
		pdf.setColor(color);
	});

	$('#brush-size').change(function() {
		var width = $(this).val();
		pdf.setBrushSize(width);
	});

	$('#font-size').change(function() {
		var font_size = $(this).val();
		pdf.setFontSize(font_size);
	});

	$('#a-12').click(function() {
		window.open('https://it-blocks.com/', '_blank')
	});

	$('#inputFile').change(function() {
		var filePath = $('#inputFile').val();
		var newPath = filePath.replace(/\\/g, '/');
		var strArr = newPath.substr(newPath.lastIndexOf('.'));
		var fileExt = strArr.split('.')[1];
		var strArrName = newPath.substr(newPath.lastIndexOf('/'));
		var filename = strArrName.split('/')[1];
		$('.pageName').html(filename);
//		$('.pageName').attr('aria-label',filename);
		$('.pageName').attr('title', filename);
		if (fileExt != 'pdf' && fileExt != 'PDF') {
			// Swal.fire('Please, ( PDF ) file only');
			// / alert message with 3s timer ...
			message('Please, ( PDF ) file only', 3000);

		} else {
			$('#pdf-container').html('');
		}
	});

	// upload PDF
	$('#open-pdf').click(function(e) {
		e.stopPropagation();
		$('#inputFile').click();
		$('.colors').removeClass('not-active');
	})

	// upload Image
	$('#open-img').click(function(e) {
		e.stopPropagation();
		if ($('#pdf-container').html() == '') {
			message('There is no content ,please upload PDF file', 4000);
		} else {
			$('#inputImage').click();
		}
	})

	$('#colors').click(function(e) {
		e.stopPropagation();
		$('.colors').addClass('not-active');
	});

	// to scroll up
	toScrollUp();

	// ancor itblocks
	$('.itblocks').click(function() {
		$('#a-12').click();
	});

	// it-block facebook
	$('.facebook').click(function() {
		window.open('http://www.facebook.com/IT.BLOCKS', '_blank');
	});

	// it-block linkedIn
	$('.linkedin').click(function() {
		window.open('https://www.linkedin.com/company/it-blocks', '_blank');
	});

	// help come soon
	$('.help').click(function() {
		message('help page come soon', 3000);
	});

	$('button#color').on('click', function(e) {
		e.stopPropagation();
		sel = window.getSelection();
		if (sel.rangeCount && sel.getRangeAt) {
			var range = sel.getRangeAt(0);
		}
		// Set design mode to on
		document.designMode = "on";
		if (range) {
			sel.removeAllRanges();
			sel.addRange(range);
		}
		console.log(range)
		// Colorize text
		document.execCommand("BackColor", false, $(this).prop('title')); // false
		// for
		// not
		// edit
		// any
		// text

		// Set design mode to off
		document.designMode = "off";

	});
});
$(document).click(function() {
	$('.colors').removeClass('not-active');
	pageNO();
});
