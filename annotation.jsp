<!DOCTYPE html>
<html lang="en">
<head>
	<script src="lib/jquery/jquery.js"></script>
	<script src="js/application/PropertiesReader.js"></script>
	<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>IT-Blocks PDF Viewer</title>
	<link rel="stylesheet" href="lib/bootstrap/css/bootstrap.min.css">
	<link rel="stylesheet" href="lib/font-awesome/css/all.min.css">
	<link rel="stylesheet" href="lib/prettify/css/prettify.min.css">
	<link rel="stylesheet" href="cssViewer/styles.css">
	<link rel="stylesheet" href="cssViewer/pdfannotate.css">
	<link rel="stylesheet" href="cssViewer/hint.min.css">
	<link rel="stylesheet" href="cssViewer/animate.css">

	<link rel = "icon" href ="./images/pdftitle.PNG" type = "image/x-icon">
</head>
<body>
	
	<header class="main-header ">
		<nav class="navbar navbar-expand-lg navbar-light">
				<button class="tool-button hint--bottom-right  hint--info pdf custom-margin" id="open-pdf" aria-label="Open PDF File"><i class="fas fa-folder-open fa-lg"></i></button>
				<span class="pageName hint--bottom-right  hint--info custom-margin" data-toggle="tooltip" aria-label="" title="" data-placement="bottom">File Name</span>
	
				<span class="pageNumber">Page No. <input type="number" id="pageNO"> / <span id="no-pages"> 0</span></span>
				<div class="spacer spaceer"></div>
				<button class="tool-button hint--bottom-right  hint--info pdf custom-margin " id="zoom-out" aria-label="Zoom out"><i class="fas fa-search-minus"></i></button>
				<button class="tool-button hint--bottom-right  hint--info pdf custom-margin" id="zoom-in" aria-label="Zoom in"><i class="fas fa-search-plus"></i></button>
				<div class="spacer"></div>
				<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
				
			</button>
			<div class="collapse navbar-collapse toolbar" id="navbarNavDropdown">
				<ul class="navbar-nav w-100 toolbar">
					<li class="tool">
						<i class="fas fa-paint-brush"></i>
						<select id="brush-size">
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
							<option value="9">9</option>
							<option value="10">10</option>
						</select>  
					 </li>
					 <li class="tool">
						<i class="fas fa-font"></i>			
						<select id="font-size">
						<option value="10">10</option>
						<option value="12">12</option>
						<option value="16">16</option>
						<option value="18">18</option>
						<option value="24">24</option>
						<option value="32">32</option>
						<option value="48">48</option>
						<option value="64">64</option>
						<option value="72">72</option>
					</select> 
					 </li>
					 <li class="tool">
						<button class="tool-button hint--bottom-right  hint--info" id="colors" aria-label="Add Color"><img src="images/paint.png" alt="paletee" class="paint"/></button>
						<div class="colors">
							<button class="color hint--bottom-right  hint--info active" value="black" aria-label="Black" style="background-color: #212121;"></button>
							<button class="color hint--bottom-right  hint--info" value="darkred" aria-label="Dark Red" style="background-color: rgb(192, 0, 0);"></button>
							<button class="color hint--bottom-right  hint--info" value="red" aria-label="Red" style="background-color: rgb(255, 0, 0);"></button>
							<button class="color hint--bottom-right  hint--info" value="orange" aria-label="Orange" style="background-color: rgb(255, 192, 0)"></button>
							<button class="color hint--bottom-right  hint--info" value="yellow" aria-label="Yellow" style="background-color: rgb(255, 255, 0)"></button>
				
							<button class="color hint--bottom-right  hint--info" value="lightgreen" aria-label="Light Green" style="background-color: rgb(146, 208, 80)"></button>
							<button class="color hint--bottom-right  hint--info " value="Green" aria-label="Green" style="background-color: rgb(0, 176, 80);"></button>
							<button class="color hint--bottom-right  hint--info" value="lightblue" aria-label="Light Blue" style="background: rgb(0, 176, 240)"></button>
							<button class="color hint--bottom-right  hint--info" value="blue" aria-label="Blue" style="background-color: rgb(0, 112, 192)"></button>
							<button class="color hint--bottom-right  hint--info" value="darkblue" aria-label="Dark Blue" style="background-color: rgb(0, 32, 96);"></button>
							<button class="color hint--bottom-right  hint--info" value="purple" aria-label="Purple" style="background-color: rgb(112, 48, 160);"></button>
							<button class="color hint--bottom-right  hint--info" value="white" aria-label="White" style="background-color: rgb(255, 255, 255);"></button>
				
						</div>
					 </li>
					 <div class="spacer custom-spacer"></div>
	
					<li class="tool">
						
						<button class="tool-button hint--bottom-right  hint--info active hand " aria-label="Free Hand"><i class="fa fa-hand-paper fa-lg" onclick="enableSelector(event)"></i></button>
					   </li>
					   <div class="spacer custom-spacer "></div>
	
					<li class="tool">
						<button class="tool-button hint--bottom-right  hint--info pencil" aria-label="Pencil"><i class="fa fa-pencil-alt fa-lg " onclick="enablePencil(event)"></i></button>
				</li>
				<li class="tool" >
					<button class="tool-button hint--bottom-right  hint--info" aria-label="Add Annotation"><i class="fa fa-font fa-lg" onclick="enableAddText(event)"></i></button> 
		
				</li>
				<div class="spacer custom-spacer"></div>
	
					<li class="tool" >
						<button class="tool-button hint--bottom-right  hint--info" aria-label="Add Arrow"><i class="fa fa-long-arrow-alt-right fa-lg" onclick="enableAddArrow(event)"></i></button>
		
					</li>
					<li class="tool">
						<button class="tool-button hint--bottom-right  hint--info" aria-label="Add rectangle"><i class="far fa-square fa-lg " onclick="enableRectangle(event)"></i></button>
		
					</li>
					<li class="tool">
						<button class="tool-button  hint--bottom-right  hint--info dark" aria-label="Add Dark rectangle "><i class="fa fa-square" onclick="enableRectangleDark(event)"></i></button>
		
					</li>
					<div class="spacer custom-spacer"></div>
					<li class="tool">
						<button class="tool-button hint--bottom-right  hint--info pdf" id="open-img" aria-label="Open Image"><i class="fas fa-image"></i></button>

					</li>
					<li class="tool">
						<button class="tool-button btn-sm hint--bottom-right hint-Signature" onclick="signature()" aria-label="Signature"><i class="fa fa-signature fa-lg"></i></button>
					</li>
					<div class="spacer custom-spacer"></div>
	
					<li class="tool">
						<button class="btn btn-danger btn-sm hint--bottom-right hint--error" aria-label="Delete your Edit" onclick="deleteSelectedObject(event)"><i class="fa fa-trash fa-lg" style="width: 1em;"></i></button>
		
					</li>
					<div class="spacer custom-spacer"></div>
	
					<li class="tool">
						<button class="btn btn-outline-secondary btn-sm btn-dwn hint--bottom-right hint-download" aria-label="Download" onclick="savePDF()" ><i class="fa fa-save fa-lg" style="width: 1em;"></i></button>
					</li>
					<li class="tool">
						<button class="btn btn-outline-secondary btn-sm btn-dwn hint--bottom-right hint-print" onclick="printPDF()" aria-label="Print" ><i class="fa fa-print fa-lg"  ></i> </button>
		
					</li>
					<div class=" custom-spacer"></div>

				  <div class="ml-auto" >
					<li >
						<a><img class="it-blocks-logo" src="images/it-blocks-dark-logo.png"/></a>
		
					</li>
				  </div>
				</ul>
			</div>
		</nav>
	</header>
	<section class="wrapper">

		<!--start map-->
			<div class="map">
				<main>
					<div class="hidden-inputs">
						<input type="text" class='hiddens' id='div-id'>
						<input type="text" class='hiddens' id='img-id'>
						<input type="text" class='hiddens' id='color-id'>

						<input type="text" class='hiddens' id='origin-width'>
						<input type="text" class='hiddens' id='origin-height'>
					</div>
					<div class="uploadFile">
						<input id="inputFile" class="custom-file-input" type="file" title="" onchange="PDFViewer();" />
					</div>
					<div class="uploadImage">
						<input id="inputImage" class="custom-file-input" type="file" title="" onchange="uploadImages();" accept='image/*' />
					</div>
					<div id="pdf-container"></div>
					<!-- Responsive iFrame -->
				   
					<a id="back2Top" aria-label="Back To Up" class="hint--left "  href="#"><i class="fas fa-angle-up"></i></a>

				   
				  </main>
			 	  
		<div class="modal fade" id="dataModal" tabindex="-1" role="dialog" aria-labelledby="dataModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="dataModalLabel">PDF annotation data</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<pre class="prettyprint lang-json linenums">
						</pre>
					</div>
				</div>
			</div>
		</div>
		
		
		<div class="message">
			<h5><i class="fas fa-envelope"></i> Message</h5>
			<hr>
			<p id="app-message"> you have to add document at first ...</p>
		</div>
			</div>
	
		
			
		<!--end map-->
		
		
		</section>
		
		<div class='hiddenSysInputs'>
			<input id="docGUID" name="docGUID"  type="text" style="display:none" value="<%=request.getParameter("searchDocGuid")%>">
			<input id="annUserId" name="annUserId"  type="text" style="display:none" value="<%=request.getParameter("userId")%>">
			
			<input style="display: none; hidden: true" id="update_corrInboxIdDoc" name="corrInboxIdDoc" 
			type="text" type="text" value="<%=request.getParameter("corrInboxID")%>"> 
			
			<input style="display: none; hidden: true" id="update_corrIdDoc" name="corrIdDoc" 
			type="text" type="text" value="<%=request.getParameter("corrID")%>">
			
			<input style="display: none; hidden: true" id="update_DocID" name="DocID" 
			type="text" type="text" value="<%=request.getParameter("docID")%>"> 
			
			<input style="display: none; hidden: true" id="update_DocBarCode" name="DocBarCode" type="text" type="text"> 
			<input style="display: none; hidden: true" id="update_DocVsID" name="DocVsID" 
			type="text" type="text" value="<%=request.getParameter("docVsID")%>"> 
			
			<input style="display: none; hidden: true" id="update_VsID" name="VsID" 
			type="text" type="text" value="<%=request.getParameter("vsid")%>">
			
			<input style="display: none; hidden: true" id="update_docType" name="update_docType" 
			type="text" type="text" value="<%=request.getParameter("docTypeId")%>">
			
			<input style="display: none; hidden: true" id="update_fileIdDoc" name="fileIdDoc" 
			type="text" type="text" value="<%=request.getParameter("fileId")%>">
			
			<input style="display: none; hidden: true" id="update_Type" name="update_Type" 
			type="text" type="text" value="<%=request.getParameter("type")%>">
		</div>






<script src="lib/bootstrap/js/bootstrap.bundle.min.js" ></script>
<script src="lib/font-awesome/js/all.min.js"></script>
<script src="jsViewer/popper.min.js"></script>
<script src="lib/pdf2.0.398/pdf.min.js"></script> 
<script src="jsViewer/sweetAlert"></script>
<script src="jsViewer/fabric.js"></script>
<script src="jsViewer/jspdf.debug.js"></script>
<script src="lib/prettify/js/run_prettify.js"></script>
<script src="lib/prettify/js/prettify.min.js"></script>
<script src="jsViewer/arrow.fabric.js"></script>
<script src="jsViewer/pdfannotate.js"></script>
<script src="jsViewer/script.js"></script>
<script src="jsViewer/html2pdf.bundle.js"></script>
<script src="jsViewer/print.min.js"></script>
</body>
</html>
