(function(){
  //点击“去注册账号”的链接
  $('#link-reg').click(function(){
    $('.login-box').hide()
    $('.reg-box').show()
  })

  //点击‘去登录’的链接
  $('#link-login').click(function(){
    $('.login-box').show()
    $('.reg-box').hide()
  })

  //要想使用form的一些属性的得先从layui中获取form对象
let form = layui.form
let layer = layui.layer

//通过form.verify()函数自定义校验规则
form.verify({
    pwd:[/^[\S]{6,12}$/
    ,'密码必须6到12位，且不能出现空格'],

    //自定义两次密码是否一致的校验规则 
    repwd: function(value){
   //通过形参拿到的是再次确认密码框中的内容
   //现在要拿到密码框中的内容
    let pwd = $('.reg-box [name=password]').val()
    if(pwd !== value){
      return '两次输入密码不一致'
    }
    }
})


  //监听注册表单的提交事件
  $('#form_reg').on('submit',function(e){
    e.preventDefault()

    let data = {username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()}
    //发起Ajax的post请求
    $.post('/api/reguser',data,function(res){
      if(res.status !== 0){
        return layer.msg(res.message)
      }
      layer.msg('注册成功，请登录')
      //模拟点击行为
      $('#link-login').click()
    })
  })
  
  //监听登陆表单的提交事件
  $('#form_login').submit(function(e){
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      //快速获取表单中的数据
      data: $(this).serialize(),
      success: function(res){
        if(res.status !== 0){
          return layer.msg('登陆失败')
        }
        layer.msg('登录成功！')

      localStorage.setItem('token',res.token)
        //跳转到主页
        location.href = '/大事件项目/index.html'
      }
    })
  })

})();



