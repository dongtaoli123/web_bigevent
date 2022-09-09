//每次调用$.get()或$.post()或$.ajax()的时候
//会先调用ajaxPrefilter这个函数
//在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options){
    // console.log(options);
    //在发起真正的Ajax之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007'+options.url
    // console.log(options.url);

    //统一为有权限的接口设置headers请求头
    //判断包不包含my
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {Authorization:localStorage.getItem('token') || ''}
    }
    

    //全局统一挂载complete回调函数
    options.complete = function(res){
           //在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        //    console.log(res);
           if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
               //强制清空token
               localStorage.removeItem('token')
               //强制跳转回登陆页面
               location.href = '/大事件项目/login.html'
           }
    }
})

