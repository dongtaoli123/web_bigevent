(function(){
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    //定义时间过滤器
    template.defaults.imports.dataFormat = function(date){
         let dt = new Date(date)

         let y = dt.getFullYear()
         let m = padZero(dt.getMonth() + 1)
         let d = padZero(dt.getDate())

         let hh = padZero(dt.getHours())
         let mm = padZero(dt.getMinutes())
         let ss = padZero(dt.getSeconds())

         return y + '-' + m + '-' + d + ' ' + hh +':'+mm+':'+ss
    }

    //定义一个补零的方法
    function padZero(n){
        return n > 9 ? n : '0' + n
    }

    //定义一个查询的参数对象，将来请求数据的时候，
    //需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1,//页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示两条
        cate_id: '', //文章分类的id
        state: '' //文章发布的状态
    }
    
    //获取文章列表数据的方法
    function initTable(){
       $.ajax({
        method: 'get',
        url: '/my/article/list',
        data: q,
        success:function(res){
            // console.log(res);
            if(res.status !== 0){
                return layer.msg('获取文章列表失败')
            }
           let htmlStr = template('tpl-table',res)
           $('tbody').html(htmlStr)
           renderPage(res.total)
        }
       }) 
    }
    initTable()
    
     
    //初始化文章分类的方法
    function initCate() {
        $.ajax({
          method: 'GET',
          url: '/my/article/cates',
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('获取分类数据失败！')
            }
            // 调用模板引擎渲染分类的可选项
            var htmlStr = template('tpl-cate', res)
            $('[name=cate_id]').html(htmlStr)
            // 通过 layui 重新渲染表单区域的UI结构
            form.render()
          }
        })
      }
      initCate()

      //为筛选表单绑定 submit事件
      $('#form-search').on('submit',function(e){
        e.preventDefault()
        //获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        //为查询参数对象q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新的筛选条件，重新渲染表格数据
        initTable()
      })


      //定义渲染分页的方法
      function renderPage(total){
        // console.log(total);
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            //分页发生切换的时候，触发jump回调
            layout: ['count','limit','prev','page','next','skip'] ,
            limits:[2,3,5,10],
            //控制每页展示几条数据
            jump: function(obj,first){
        //可以通过first的值，来判断是通过哪种方式触发的jump回调
        //如果first的值为true，证明是方式2触发的
        //否则就是方式1触发的
        console.log(first);

        //触发jump回调的方式有两种：
        //1.点击页码的时候，会触发jump回调
        //2.只要调用了laypage.render()方法，就会触发jump回调
                console.log(obj.curr);
                //把最新的页码值，赋值到q这个查询对象参数中
                q.pagenum = obj.curr

            //把最新的条目数，赋值到q这个查询参数对象的pagesize属性中
            q.pagesize = obj.limit //每页显示的条数

                 //根据最新的q获取对应的数据列表，重新渲染表格数据
                //  initTable()
                 //直接调用会发生死循环
            if(!first){
                initTable()  
            }

            }
        })
      }


      //通过事件委托，为删除按钮绑定点击事件处理函数
      $('tbody').on('click','.btn-delete',function(){
        //获取删除按钮的个数
        let len = $('.btn-delete').length
        // console.log(len);
        //获取文章的id
        let id = $(this).attr('data-id')
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            //do something
        $.ajax({
            method: 'get',
            url: '/my/article/delete/' + id,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('删除文章失败')
                }
                 layer.msg('删除文章成功')
                //当数据删除完成后，需要判断当前这一页中是否还有剩的数据
                //如果没有剩余数据，让页码值-1之后，
                //再重新调用initTable方法
                if(len === 1){
                //如果len的值等于1，证明删除之后，页面上就没有数据了
                //页码值最小必须是1
                q.pagenum = q.pagenum === 1 ? 1 :q.pagenum -1

                    }
                    initTable()
                }
            })
            
            layer.close(index);
          })
      })
})()