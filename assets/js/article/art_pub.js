(function(){
    let layer = layui.layer
    let form = layui.form
    //定义加载文章分类的方法
    function initCate(){
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('初始化文章分类失败')
                }
                //调用模板引擎，渲染分类的下拉菜单
               let htmlStr = template('tpl-cate',res)
               $('[name=cate_id]').html(htmlStr)
               //一定要调用form.render()方法  重新渲染表单结构   
               form.render()
            }
        })
    }
    initCate()
    // 初始化富文本编辑器
    initEditor()


      // 1. 初始化图片裁剪器
  var $image = $('#image')
  
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  
  // 3. 初始化裁剪区域
  $image.cropper(options)
 

//   为选择封面的按钮，绑定点击事件
   $('#btnChooseImage').click(function(){
    $('#coverFile').click()
   })

//    监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change',function(e){
        let files = e.target.files
        if(files.length === 0){
            return
        }
        //如果选择了文件，就根据文件创建对应的url地址
        let newImgURL = URL.createObjectURL(files[0])
        //为裁剪区域重新设置图片
        $image
           .cropper('destroy')      // 销毁旧的裁剪区域
           .attr('src', newImgURL)  // 重新设置图片路径
           .cropper(options)        // 重新初始化裁剪区域
    })

    //定义文章的发布状态，默认为已发布
    let art_state = '已发布'
    //为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').click(function(){
        art_state = '草稿'
    })

    //为表单绑定submit提交事件
    $('#form-pub').on('submit',function(e){
        e.preventDefault()
       let fd = new FormData($(this)[0])
       //基于form表单，快速创建一个formdata对象

       //将文章发布状态 存到fd中
       fd.append('state',art_state)
       
     //将封面裁剪后的图片，输出为一个文件对象
     $image
       .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
         width: 400,
         height: 280
       })
     .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
    // 得到文件对象后，进行后续的操作
      fd.append('cover_img',blob)

      //发起Ajax数据请求
      publishArticle(fd)
    })
    })
    //定义一个发布文章的方法
    function publishArticle(fd){
    $.ajax({
        method: 'post',
        url: '/my/article/add',
        data:fd,
        //注意：如果向服务器提交的是formdata 格式的的数据,必须添加以下两个配置项
        contentType: false,
        processData: false,
        success:function(res){
            if(res.status !== 0){
              return layer.msg('发布文章失败')
            }
            layer.msg('发布文章成功')
            location.href = '/大事件项目/article/art_list.html'
        }
    })
    }

})()