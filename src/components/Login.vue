<template>
	<div id="login_container">
		<div class="login_box">
			<!-- 登录表单 -->
			<el-form class="login_form"
			:model="loginForm"
			:rules="loginFormRules"
			ref="loginFormRef">
			  <!-- 教职工号 -->
			  <el-form-item prop="userId">
			    <el-input 
					placeholder="请输入教工号"
					prefix-icon="iconfont icon-user"
					v-model="loginForm.userId"
					>
				</el-input>
			  </el-form-item>
			  <!-- 密码 -->
			  <el-form-item prop="password">
			    <el-input 
					placeholder="请输入密码"
					prefix-icon="iconfont icon-Lock"
					show-password
					v-model="loginForm.password">
				</el-input>
			  </el-form-item>
			  <!-- 按钮 -->
			  <el-form-item class="btns">
			    <el-button type="primary" @click="login">登录</el-button>			      
			     <el-button type="info" @click="resetLoginForm">重置</el-button>
			  </el-form-item>
			</el-form>			
		</div>
	</div>
	
</template>

<script>
	export default{
		data(){
			var validateUserId = (rule, value, callback) => {
			        var patt = /^[0-9]*$/
			        var r = patt.test(value)				
					if (!r) {
			          callback(new Error('教工号必须为数字'))
			        } else {
			          callback()
			        }
			};
			return {
				loginForm: {
					userId: '100001',
					password: '123456'
				},
				loginFormRules: { //表单项验证规则对象, 名称的定义必须和loginForm中一致
				          userId: [ //属性名userId 要与loginForm中属性名userId一致
				            { required: true, message: '请输入教工号', trigger: 'blur' },
				            { min: 6, max: 6, message: '教工号长度为6位', trigger: 'blur' },
							{ validator: validateUserId, trigger: 'blur' }							
				          ],
						  password: [
							  { required: true, message: '请输入密码', trigger: 'blur' },
							  { min: 6, max: 18, message: '密码长度须在6到18位之间', trigger: 'blur' }
						  ]
				}
			}
		},
		methods: {
			resetLoginForm(){ //重置表单
				//console.log(this)				
				this.$refs.loginFormRef.resetFields()
			},
			login(){ //登录
				this.$refs.loginFormRef.validate(async valid => {
					//console.log(valid)
					if(!valid) {
						this.$message.error('登录表单数据格式错误')
						return
					}					
					var {data: res} = await this.$http.post('/faculty/login',this.loginForm)
					
					console.log(JSON.stringify(res))
					
					if(res.code!==0){ //服务器返回错误信息
						this.$message.error(res.message)
						return
					}else{
						this.$message.success('登录成功')
						window.sessionStorage.setItem('token',res.data.token)
						this.$router.push('/home')																														
					}
					
					
					
				})
			}
			
		}
		
	}
</script>

<style lang="less" scoped>
	#login_container {
		background-color: #2b4b6b;
		height: 100%;
		.login_box {
			width: 450px;
			height: 300px;
			border-radius: 5px;
			background-color: #fff;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
			.login_form {
				position: absolute;
				bottom: 0;
				width: 100%;
				padding: 0 20px;
				box-sizing: border-box;
				
				.btns {
					display: flex;
					justify-content: flex-end;
				}
			}
		}
		
	}
</style>
