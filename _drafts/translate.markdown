### 我是一个`puts` debuggerer
----
####我喜欢用`puts`调试代码

我是一个`puts` debuggerer，但我并没有贬低利用工具调试代码的人的意思。相反，我认为能用现有的工具做调试的程序员是非常棒的，然而我却从来没有花时间去好好的学习一种调试工具。每次我尝试着去学习，最终都以不在实际项目中实践而告终，以至于不得不再重新去学习。不管怎样，在这里我还是要和大家分享一下我使用`puts`做调试的一些方法。当我搞不懂一些功能是如何实现的时候，当我想对某些代码做更深入的了解的时候，我都会用到这些方法。
下面列举的大多数的事例确实不是最佳的实践，但在调试的练习中最好不要脱离了这些例子中的代码。不管怎样，我认为将任何东西调试通过才是重要的。 我所说的任何东西指的是，全局变量， 重定义方法, 添加条件判断, 修改加载路径, 猴子布丁, 输出调用栈, 等等.

我已经尝试坚持在本文中列举真实的例子。其实，这些例子都是我在调试Rails项目中的安全问题遇到的，所以希望大家能多使用我所展示的这些方法，而不只是看懂示例代码。示例中我调试的代码是不完整的，因此我也并不希望大家去使用它们。

我将我曾遇到的一些问题作为每一节的标题，内容就是我解决这些问题的方法。

###我知道问题在哪，但不知道问题是如何产生的

有些时候，我们在调试一些问题的时候，知道它在哪出的错却不知道它为何会在这里出错。通常这个时候我就会`puts caller`来得到它的调用栈。
例如下面这个例子：

	LOOKUP = Hash.new { |h, k| h[k] = Type.new(k) unless k.blank? }

但是我需要知道给出的代码块是如何被调用的，我做了如下调试：

 	LOOKUP = Hash.new { |h, k|
     puts "#" * 90
     puts caller
     puts "#" * 90
     h[k] = Type.new(k) unless k.blank?
  	}

上面的代码将会打印出90个`#`（hash tags），然后是调用栈，然后再次打印出90个`#`（hash tags）。我打印‘#’标签是为了容易区别在多次执行的时候打印多条回调栈。注意我在这里称它们为“hash tags”就是为了引起你的关注。
这个做法很频繁，所以我设置了个Vim快捷键：

	" puts the caller
	nnoremap <leader>wtf oputs "#" * 90<c-m>puts caller<c-m>puts "#" * 90<esc>

这样我只要`<leader>wtf`就能在我的当前行的下面插入那三行内容。

##### 我只想打印一遍调用栈
只需要在输出调用栈的下一行使用`exit!`或这调用`raise`方法。`raise`将会抛出异常这样就可以查看输出的栈了
##### 我只想在特定的条件下查看输出的栈
有一段调试代码，你可以做任何你想做的。比如说我想在给hash添加值的时候查看栈。做法如下：

	LOOKUP = Hash.new { |h, k|
    	unless k.blank?
       puts "#" * 90
       puts caller
       puts "#" * 90
       h[k] = Type.new(k)
    end
  	}
因为无论如何我都要丢掉这段代码，所以我可以任意的我想添加的各种怪异的条件！

#### 我调用了一个方法，但我不知道这个方法在哪里执行

在这个例子中我调用了一个方法，但是我不知道这个方法是在哪里执行的，我可以将`method`方法连同`source_location`方法一起使用。例如，在一个控制器中我有一个方法调用了`render`方法，我想找到这个方法：

	def show
  		render params[:id]
	end

我对上面的方法做如下的改动：

	def index
  		p method(:render).source_location
  		render params[:id]
	end

执行这个方法：

	$ curl http://localhost:3000/users/xxxx

然后在日志中就看到下面的输出：
 
	Processing by UsersController#show as */*
	Parameters: {"id"=>"xxxx"}
	["/Users/aaron/git/rails/actionpack/lib/action_controller/metal/instrumentation.rb", 40]
	Completed 500 Internal Server Error in 35ms (ActiveRecord: 0.0ms)
	
现在我知道那个`render`方法是在[instrumentation.rb的第40行](https://github.com/rails/rails/blob/6fcc3c47eb363d0d3753ee284de2fbc68df03194/actionpack/lib/action_controller/metal/instrumentation.rb#L40)。

#### 我调用了`super`方法，但我不知道它是在哪里执行的。
我们可以看到`render`方法[调用了`super`方法](https://github.com/rails/rails/blob/6fcc3c47eb363d0d3753ee284de2fbc68df03194/actionpack/lib/action_controller/metal/instrumentation.rb#L43)但我又不知道它的`super`是在哪里执行的。在这个例子中，我用`super_method`在`method`方法之后。
我将下面这段代码：

	def index
  		p method(:render).source_location
  		render params[:id]
	end

改为：

	def index
  		p method(:render).super_method.source_location
  		render params[:id]
	end
	
用上面相同的请求执行这个方法，然后得到了下面的输出：
	
	Processing by UsersController#show as */*
  		Parameters: {"id"=>"xxxx"}
	["/Users/aaron/git/rails/actionpack/lib/action_controller/metal/rendering.rb", 34]
	Completed 500 Internal Server Error in 34ms (ActiveRecord: 0.0ms)

现在我看到`super`方法在[这里执行](https://github.com/rails/rails/blob/6fcc3c47eb363d0d3753ee284de2fbc68df03194/actionpack/lib/action_controller/metal/rendering.rb#L34)。可是这个方法还是调用了`super`，我可以重复上面的过程(或者利用循环)直到找到我确实关注的方法。

#### 如果某对象自己有可以执行的`method`方法怎么办?
有时`method`这个技巧并不能很好的工作，因为有些我想去了解的对象，它已有属于自己版本的可以执行的`method`方法。例如，我想试着找到`headers`方法是在`request`对象的什么地方被执行的，代码如下：

	def index
  		p request.method(:headers).source_location
  		@users = User.all
	end
当我在终端发送请求，我得到了这个错误：

	ArgumentError (wrong number of arguments (given 1, expected 0)):
  app/controllers/users_controller.rb:5:in `index'

这是因为`request`对象执行了它自己定义的同样叫`method`的方法。为了找到`headers`方法在哪里，我必须得到`Kernel`模块的`method`方法，并把它添加到`request`对象中，然后就得到如下的操作：

	def index
  		method = Kernel.instance_method(:method)
  		p method.bind(request).call(:headers).source_location
  		@users = User.all
	end

在终端再次发送请求，我得到了如下的输出：

	Processing by UsersController#index as */*
	["/Users/aaron/git/rails/actionpack/lib/action_dispatch/http/request.rb", 201]
	
现在我知道`headers`方法是在[这里](https://github.com/rails/rails/blob/6fcc3c47eb363d0d3753ee284de2fbc68df03194/actionpack/lib/action_dispatch/http/request.rb#L201)被执行的。
我甚至可以像下面这样找到`method`方法执行的地方：

	def index
  		method = Kernel.instance_method(:method)
  		p method.bind(request).call(:method).source_location
  		@users = User.all
	end

#### 我调用了某个方法，但我还是不知道它是在哪里执行的
有时立即调用的方法并不是我真的想关心的那个方法，因此用`method`这个方法并不能找到我想找的。这时我就要使用`TracePoint`这个更大的锤子了。我们还用`render`这个例子来得到所有被`render`调用的方法列表。我们看到的被列出来的这些方法可能并不是直接在`render`方法中直接调用的，或是其它地方调用的。

	# GET /users
  	# GET /users.json
  	def index
    	@users = User.all
    	tp = TracePoint.new(:call) do |x|
      		p x
    	end
    	tp.enable
    	render 'index'
  	ensure
    	tp.disable
  	end

`TracePoint`放在这里将会触发每个`call`事件，并且在块里打印出对应的方法名和位置。A “call” even it when a Ruby method gets called (not a C method). If you want to see C methods as well, use :c_call. This example will produce a ton of output. I really only use this technique when the number of methods being called is fairly small, or I don’t even know where to begin looking.

#### 我知道
有时一个异常被抛出，但我不知道确切是在那里抛出这个异常的。这个例子使用Rails 3.0.0（我们已经解决了这个问题），假如你有下面这段代码：

	ActiveRecord::Base.logger = Logger.new $stdout
	User.connection.execute "oh no!"

我知道这个SQL不能正常执行，并且会抛出异常。我们来看看这个异常具体是什么样的：

	SQL (0.1ms)  oh no!
	SQLite3::SQLException: near "oh": syntax error: oh no!
	activerecord-3.0.0/lib/active_record/connection_adapters/	abstract_adapter.rb:202:in `rescue in log': 	SQLite3::SQLException: near "oh": syntax error: oh no! 	(ActiveRecord::StatementInvalid)
		from activerecord-3.0.0/lib/active_record/connection_adapters/abstract_adapter.rb:194:in `log'
		from activerecord-3.0.0/lib/active_record/connection_adapters/sqlite_adapter.rb:135:in `execute'
		from test.rb:6:in `<top (required)>'
		from railties-3.0.0/lib/rails/commands/runner.rb:48:in `eval'
		from railties-3.0.0/lib/rails/commands/runner.rb:48:in `<top (required)>'
		from railties-3.0.0/lib/rails/commands.rb:39:in `require'
		from railties-3.0.0/lib/rails/commands.rb:39:in `<top (required)>'
		from script/rails:6:in `require'
		from script/rails:6:in `<main>'

根据日志输出的结果，它好像告诉我们异常是在[abstract_adapter.rb第202行](https://github.com/rails/rails/blob/9891ca8/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb#L202)抛出的。然而你很快会注意到这段代码在[抛出一个异常后，又抛出了一次](https://github.com/rails/rails/blob/9891ca8/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb#L199-L202)。所以哪里才是这个异常确切的抛出的地方呢？为了找到异常的位置，我们可以添加一些`puts`声明，或者在Ruby指令中使用`-d`标示，像下面这样：

	[aaron@TC okokok (master)]$ bundle exec ruby -d script/rails runner test.rb

`-d`标示会将警告也输出同时输出抛出异常的每一行。确实会输出一大堆东西，但在输出内容结尾的地方你能看到下面这些内容：

	Exception `NameError' at activesupport-3.0.0/lib/active_support/	core_ext/module/remove_method.rb:3 - method `_validators' not 	defined in Class
	Exception `SQLite3::SQLException' at sqlite3-1.3.11/lib/sqlite3/	database.rb:91 - near "oh": syntax error
	Exception `SQLite3::SQLException' at activesupport-3.0.0/lib/	active_support/notifications/instrumenter.rb:24 - near "oh": syntax error
  		SQL (0.1ms)  oh no!
	SQLite3::SQLException: near "oh": syntax error: oh no!
	Exception `ActiveRecord::StatementInvalid' at activerecord-3.0.0/lib/active_record/connection_adapters/abstract_adapter.rb:202 - SQLite3::SQLException: near "oh": syntax error: oh no!
	Exception `ActiveRecord::StatementInvalid' at railties-3.0.0/lib/rails/commands/runner.rb:48 - SQLite3::SQLException: near "oh": syntax error: oh no!
activerecord-3.0.0/lib/active_record/connection_adapters/abstract_adapter.rb:202:in `rescue in log': SQLite3::SQLException: near "oh": syntax error: oh no! (ActiveRecord::StatementInvalid)
		from activerecord-3.0.0/lib/active_record/connection_adapters/abstract_adapter.rb:194:in `log'
		from activerecord-3.0.0/lib/active_record/connection_adapters/sqlite_adapter.rb:135:in `execute'
		from test.rb:6:in `<top (required)>'
		from railties-3.0.0/lib/rails/commands/runner.rb:48:in `eval'
		from railties-3.0.0/lib/rails/commands/runner.rb:48:in `<top (required)>'
		from railties-3.0.0/lib/rails/commands.rb:39:in `require'
		from railties-3.0.0/lib/rails/commands.rb:39:in `<top (required)>'
		from script/rails:6:in `require'
		from script/rails:6:in `<main>'

你会看到最开始的一个异常：

	Exception `SQLite3::SQLException' at sqlite3-1.3.11/lib/sqlite3/database.rb:91 - near "oh": syntax error

并且在后面它被再次抛出：

	Exception `SQLite3::SQLException' at activesupport-3.0.0/lib/active_support/notifications/instrumenter.rb:24 - near "oh": syntax error
	
在这个例子中，异常捕捉到抛出后又抛出了一次，其实它本该只抛出异常最开始的地方。所以说这是个bug，但它已经修复了，改日我们再讨论它是如何修复的。

#### 我想在命令行用`-d`运行一个指令
比如你想用上面的方法加上`-d`标示运行你的RSpec测试用例，你可以这样做：

	$ ruby -d -S rspec

#### 我想使用`-d`标示，但我不知道怎么去运行这个进程
默认情况下，Rake test task将在[子进程中运行你的测试用例](https://github.com/ruby/rake/blob/3c4fe3e25e5ab6b052f9e81bc2920ca4b4fc1094/lib/rake/testtask.rb#L105)。这就意味着运行`ruby -d -S rake`不会在运行测试的进程中开始调试的标示，在这个例子中我用`RUBYOPT`环境变量像下面这样：

	[aaron@TC okokok (master)]$ RUBYOPT=-d bundle exec rake test

`RUBYOPT`环境变量将被应用到每个在终端运行的Ruby程序中，即使是rake的一个子进程。这样上面的`rspec`的命令可以写成下面这样：

	$ RUBYOPT=-d rspec

#### 我需要找到这个对象是在哪里定义的

通常情况下打印调用栈会告诉我一个对象是在哪里定义的。但是有时候有些对象在调用栈之外，所以想找到这个对象定义在哪里就有点困难了。例如下面这段代码：

	def foo
 	 	x = baz
  		bar x
	end

	def bar x
  		puts "#" * 90
  		puts caller
  		puts "#" * 90
  		p x
	end

	def baz; zot;        end
	def zot; Object.new; end

	foo

我用“我知道问题在哪，但不知道问题是如何产生的”这一节中的“wtf”这个方法，打印出了‘x’的值，其实我真的关心的是‘x’的值是如何被分配的，如果你回头查看调用栈中`foo`方法，我发现是从一个叫`baz`的对象上得到的这个值。 In large code bases, it can be very tricky to follow all the calls and logic through a sibling tree (if you think about the code as a graph, then the `foo` method has two children, `baz` and `bar`, so you can think of `baz` as being a sibling to `bar`). I am lazy and I don't want to go chasing through all the methods to find how this object came to be, so I like to use Ruby's object allocation tracer. Ruby's allocation tracer has been available since Ruby 2.1 (don't quote me on that). When I use it, I require and enable it as soon as possible. Then I print out the allocation location at the place I care about, like this:

	require 'objspace'
	ObjectSpace.trace_object_allocations_start

	def foo
  		x = baz
  		bar x
	end

	def bar x
  		p ObjectSpace.allocation_sourcefile(x) => ObjectSpace.allocation_sourceline(x)
	end

	def baz; zot;        end
	def zot; Object.new; end

	foo
	
当我运行这段程序，输出结果如下：

	[aaron@TC tlm.com (master)]$ ruby x.rb 
	{"x.rb"=>14}
	[aaron@TC tlm.com (master)]$ 

我发现这个对象被定义在`x.rb`的第14行。于是我找到对应的方法和对应的行，然后重复“wtf”这个方法直到发现这个程序发生了什么错误。

#### 我需要

上面的方法只会告诉你在`trace_object_allocations_start`被调用之后的对象的分配信息。现在我们讨论在文件被引用的时候对象分配的情况，但你不知道是什么文件和哪里的文件。这种情况下，我想执行一段代码

	require 'active_record'

	ActiveRecord::Base.establish_connection adapter: 'sqlite3', database: ':memory:'

	ActiveRecord::Base.connection.instance_eval do
  		create_table :users
	end

	class User < ActiveRecord::Base; end
		p ObjectSpace.allocation_sourcefile(User::BLACKLISTED_CLASS_METHODS) =>
    ObjectSpace.allocation_sourceline(User::BLACKLISTED_CLASS_METHODS)

但我们不知道哪个文件分配了这个常量，其实我也没想知道（确实这样有点做作）。我来写个文件，在这个例子中我将文件命名为`y.rb`，如下所示：

	require 'objspace'
	ObjectSpace.trace_object_allocations_start

然后我使用Ruby的命令行参数引用这个文件并且执行我的程序：
	
	[aaron@TC tlm.com (master)]$ ruby -I. -ry x.rb
	{"/Users/aaron/.rbenv/versions/ruby-trunk/lib/ruby/gems/2.4.0/gems/activerecord-5.0.0.beta1/lib/active_record/attribute_methods.rb"=>35}
	[aaron@TC tlm.com (master)]$ 

我们分解Ruby命令的参数，`-I`是说“添加.（当前路径）到加载路径中”，`-ry`相当于`require 'y'`，然后执行`x.rb`文件。所以`.`被添加到加载路径中，并且在Ruby指令开始执行`x.rb`之前引用了`y.rb`。然后我们就能看到`BLACKLISTED_CLASS_METHODS`被分配在`attribute_methods.rb `文件的35行。你的代码如果是在子进程的情况下运行的，也可以结合`RUBYOPT`方法一起使用，像下面这样：
	
	$ RUBYOPT='-I. -ry' rake test

#### 一个对象被改变，但不知道是在哪里发生变化的

有时我执行到一个对象，并且我知道这个对象已经发生了改变，但我不知道它是在哪开始变化的。这个情况下，我将在对象上使用`freeze`方法，

#### 我有一个死循环，但不知道这个死循环是哪里引起的

#### 我想知道一个方法是什么时候被执行的，执行的确切的时间。











