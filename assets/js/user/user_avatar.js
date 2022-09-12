  
  let layer = layui.layer
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比  指定裁剪框是什么形状的
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  //点击按钮上传文件
  $('#btnChooseImage').click(function(){
    $('#file').click()
    //模拟了一下用户的点击事件
    })
   
    //为文件选择框绑定change事件 就是判断用户有没有选择文件
    $('#file').on('change',function(e){
        let fileList = e.target.files
        //通过e.target.files 可以获取到用户选择的文件 是一个数组
        if(fileList.length === 0){
            return
        }
        //拿到用户选择的文件
        let file = fileList[0]
        //将文件转化为路径
        let imgURL = URL.createObjectURL(file)
        //重新初始化裁剪区域
        $image.cropper('destroy') //销毁旧的裁剪区域
               .attr('src',imgURL) //重新设置图片路径
               .cropper(options)
    })
      //将裁剪后的图片上传到服务器
  $('#btnUpload').on('click',function(){
    //先拿到裁剪的图片
    var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
 
     //发起请求
     $.ajax({
        method: 'post',
        url: '/my/update/avatar',
        data:{
            avatar: dataURL
        }
        ,
        success:function(res){
            if(res.status !== 0){
                return layer.msg('更换头像失败')
            }
            layer.msg('更换头像成功')
            window.parent.getUserInfo()
        }
     })
    })




