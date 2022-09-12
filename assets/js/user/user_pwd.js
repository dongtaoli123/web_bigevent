(function(){
  
      //自定义校验规则
      let form = layui.form
      let layer = layui.layer
      form.verify({
          pwd:[
              /^[\S]{6,12}$/
              ,'密码必须6到12位，且不能出现空格'
            ] 
           ,samePwd:function(value){
              if(value === $('[name=oldPwd]').val()){
                return '新旧密码不能相同'
              }
          }
          ,rePwd:function(value){
              if(value !== $('[name=newPwd]').val()){
                  return '两次密码不一致'
              }
          },
  
      })

      //发起重置密码的请求
      $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
          method: 'post',
          url: '/my/updatepwd',
          data: $(this).serialize(),
          success:function(res){
            if(res.status !==0){
              return layer.msg('重置密码失败')
            }
            layer.msg('更新密码成功')

            $('.layui-form')[0].reset()
            //重置表单  将jQuery先转成dom对象，才能调用reset方法
          }
        })
      })
})()

