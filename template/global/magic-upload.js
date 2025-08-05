$(function () {
  if (typeof oldimg !== "undefined" && oldimg !== null) {
    if (oldimg) {
      var fontplus =
        '<img alt="点击更换图片" title="点击更换图片" src=' +
        oldimg +
        ' style="max-width:305px;max-height:100px;z-index:1;display:block;float:left;"><font style="display:block;color:white;margin-left:43.2%;position:absolute;z-index:2;">+</font>';
    } else {
      var fontplus = "<font>+</font>";
    }
  } else {
    var fontplus = "<font>+</font>";
  }
  
  if (typeof oldimg2 !== "undefined" && oldimg2 !== null) {
    if (oldimg2) {
      var fontplus2 =
        '<img alt="点击更换图片" title="点击更换图片" src=' +
        oldimg2 +
        ' style="max-width:305px;max-height:100px;z-index:1;display:block;float:left;"><font style="display:block;color:white;margin-left:43.2%;position:absolute;z-index:2;">+</font>';
    } else {
      var fontplus2 = "<font>+</font>";
    }
  } else {
    var fontplus2 = "<font>+</font>";
  }
  
  if (typeof oldimg3 !== "undefined" && oldimg3 !== null) {
    if (oldimg3) {
      var fontplus3 =
        '<img alt="点击更换图片" title="点击更换图片" src=' +
        oldimg3 +
        ' style="max-width:305px;max-height:100px;z-index:1;display:block;float:left;"><font style="display:block;color:white;margin-left:43.2%;position:absolute;z-index:2;">+</font>';
    } else {
      var fontplus3 = "<font>+</font>";
    }
  } else {
    var fontplus3 = "<font>+</font>";
  }
  
  var str =
    "<a class='magic-upload magic-upload1'><input accept='image/gif,image/jpg,image/jpeg,image/png,image/GIF,image/JPG,image/JPEG,image/PNG' type='file' name='" +
    MagicUploadName +
    "'>" +
    fontplus +
    "<img class=magic-upload-img></a>";
	
  if (typeof MagicUploadName2 !== "undefined" && MagicUploadName2 !== null) {
   str +=
    "<br><a style='margin-top:10px;' class='magic-upload magic-upload2'><input accept='image/gif,image/jpg,image/jpeg,image/png,image/GIF,image/JPG,image/JPEG,image/PNG' type='file' name='" +
    MagicUploadName2 +
    "'>" +
    fontplus2 +
    "<img class=magic-upload-img2></a>";
  }
  
  if (typeof MagicUploadName3 !== "undefined" && MagicUploadName2 !== null) {
   str +=
    "<br><a style='margin-top:10px;' class='magic-upload magic-upload3'><input accept='image/gif,image/jpg,image/jpeg,image/png,image/GIF,image/JPG,image/JPEG,image/PNG' type='file' name='" +
    MagicUploadName3 +
    "'>" +
    fontplus3 +
    "<img class=magic-upload-img3></a>";
  }
  
  $("#ShowMagicUpload").html(str);
  $(".magic-upload1").on("change", "input[type='file']", function () {
    var filePath = $(this).val();
    if (
      filePath.indexOf("jpg") != -1 ||
	  filePath.indexOf("jpeg") != -1 ||
      filePath.indexOf("png") != -1 ||
      filePath.indexOf("gif") != -1 ||
      filePath.indexOf("bmp") != -1
    ) {
      $(".magic-upload1 font").html("");
      $(".magic-upload-img").attr(
        "src",
        URL.createObjectURL($(this)[0].files[0])
      );
    } else {
      alert("您没有选择图片，请重新选择需要上传的图片！");
      $(".magic-upload1 font").html("+");
      $(".magic-upload-img").hide();
      return false;
    }
  });
  
  $(".magic-upload2").on("change", "input[type='file']", function () {
    var filePath = $(this).val();
    if (
      filePath.indexOf("jpg") != -1 ||
	  filePath.indexOf("jpeg") != -1 ||
      filePath.indexOf("png") != -1 ||
      filePath.indexOf("gif") != -1 ||
      filePath.indexOf("bmp") != -1
    ) {
      $(".magic-upload2 font").html("");
      $(".magic-upload-img2").attr(
        "src",
        URL.createObjectURL($(this)[0].files[0])
      );
    } else {
      alert("您没有选择图片，请重新选择需要上传的图片！");
      $(".magic-upload2 font").html("+");
      $(".magic-upload-img2").hide();
      return false;
    }
  });
  
  $(".magic-upload3").on("change", "input[type='file']", function () {
    var filePath = $(this).val();
    if (
      filePath.indexOf("jpg") != -1 ||
	  filePath.indexOf("jpeg") != -1 ||
      filePath.indexOf("png") != -1 ||
      filePath.indexOf("gif") != -1 ||
      filePath.indexOf("bmp") != -1
    ) {
      $(".magic-upload3 font").html("");
      $(".magic-upload-img3").attr(
        "src",
        URL.createObjectURL($(this)[0].files[0])
      );
    } else {
      alert("您没有选择图片，请重新选择需要上传的图片！");
      $(".magic-upload3 font").html("+");
      $(".magic-upload-img3").hide();
      return false;
    }
  });
});
