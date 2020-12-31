import Vue from 'vue'
import { 
	Button,
	Form,
	FormItem,
	Input,
	Message,
	Container,
	Header,
	Aside,
	Main,
	Menu,
	Submenu,
	MenuItem,
	Breadcrumb,
	BreadcrumbItem,
	Card,
	Row,
	Col,
	Select,
	Option,
	Table,
	TableColumn,
	Tag,
	Pagination,
	Dialog,
	RadioGroup,
	Radio,
	Switch,
	Tooltip,
	MessageBox,
	Tree
	
	
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Select)
Vue.use(Option)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Tree)


Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

