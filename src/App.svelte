<script>
	let db;
	import Dexie from 'dexie';
	import router from "page"
	import About from './components/About.svelte'  
	import Home,{showLoginUp} from './components/Home.svelte'  
	import NoModal from './components/NoModal.svelte'  
	import Table from './components/Table.svelte'  
	import DepartmentModal, { showDept } from './components/departmentModal.svelte';
	import EatModal  from './components/eatModeModal.svelte';

	import { currentTicket, currentTable, currentTableName, cartTotal, paidAmount,cartProducts, returnHome, showLoginModal2, eatModal, eatState } from './stores.js';

	let page;
	db = new Dexie("POS1");
            db.version(55).stores({
                category: "++id,Id,DepartmentId",
                products: "++id,Id,GroupCode,portion_id,DeptId,[DeptId+GroupCode],[DeptId+Id]",
                tags: "++id,ItemID,TagID",
                orders: "++id,currentTable",
                tLayout: "++id",
                users: "++id,PinCode",
                departments: "++id"

	 });
	window.db = db;
	router('/NoModal', () => page = NoModal);
	let params;

	router('/Table', () => page = Table);
	router('/Table/:id', (ctx, next) => {
  	params = ctx.params
  	next()},  () => page = Table);
	router('/about', () => page = About);
	router('/', () => page = Home);

	router.start();
	function goToPage(pageNext) {
		 
		router('/'+pageNext);
	}
	

</script>
<svelte:head>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap.native/3.0.0/bootstrap-native.min.js"></script>
	
	</svelte:head>
	
	<body>

	<nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
		<a class="navbar-brand" href="#">Navbar</a>
		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
		  <span class="navbar-toggler-icon"></span>
		</button>
  
		<div class="collapse navbar-collapse" id="navbarsExampleDefault">
		  <ul class="navbar-nav mr-auto">
			<li class="nav-item active">
			  <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
			</li>
			<li class="nav-item">
			  <a class="nav-link" href="#">{$currentTableName}</a>
			</li>
			<li class="nav-item">
			  <a class="nav-link disabled" href="#">{$eatState}</a>
			</li>
			<li class="nav-item dropdown">
			  <a class="nav-link dropdown-toggle" href="http://example.com" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</a>
			  <div class="dropdown-menu" aria-labelledby="dropdown01">
				<a class="dropdown-item" href="#">Action</a>
				<a class="dropdown-item" href="#">Another action</a>
				<a class="dropdown-item" href="#">Something else here</a>
			  </div>
			</li>
		  </ul>
		  <form class="form-inline my-2 my-lg-0">
			<input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
			<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
		  </form>
		</div>
	  </nav>
	  <div class="sidenav" style="padding-top:100px">
		<p><i class="fa fa-pencil"  on:click={() => goToPage('NoModal')}></i></p>
		<p><i class="fa fa-dot-circle-o"  on:click={() => window.history.state.path == '/' ? showDept() : showDept() }></i></p>
		<p><i class="fa fa-user"  on:click={() => showLoginModal2.set(true)}></i></p>
		<p><i class="fa fa-spoon"  on:click={() => eatModal.set(true)}></i></p>

		<i class="fa fa-pencil"  on:click={() => showLoginUp()}></i>
		<i class="fa fa-pencil"  on:click={() => alert(page)}></i>

		
	  </div>
	  
<svelte:component this={page}  params="{params}" test={5} db={db}/>
<nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-bottom">
	<a class="navbar-brand" href="#">Navbar</a>
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
	  <span class="navbar-toggler-icon"></span>
	</button>

	<div class="collapse navbar-collapse" id="navbarsExampleDefault">
	  <ul class="navbar-nav mr-auto">
		<li class="nav-item active">
		  <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
		</li>
		<li class="nav-item">
		  <a class="nav-link" href="#">{$currentTableName}</a>
		</li>
		<li class="nav-item">
		  <a class="nav-link disabled" href="#">Disabled</a>
		</li>
		<li class="nav-item dropdown">
		  <a class="nav-link dropdown-toggle" href="http://example.com" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</a>
		  <div class="dropdown-menu" aria-labelledby="dropdown01">

			<a class="dropdown-item" href="/NoModal">Table layout</a>
			<a class="dropdown-item" href="#">Another action</a>
			<a class="dropdown-item" href="#">Something else here</a>
		  </div>
		</li>
	  </ul>
	  <form class="form-inline my-2 my-lg-0">
		<input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
		<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
	  </form>
	</div>
  </nav>
  <DepartmentModal onCloseLogin={() => departmentModal = false}  db={db} />
	<EatModal db={db} />

	</body>
	<style>
		/* The sidebar menu */
.sidenav {
  height: 100%; /* Full-height: remove this if you want "auto" height */
  width: 50px; /* Set the width of the sidebar */
  position: fixed; /* Fixed Sidebar (stay in place on scroll) */
  z-index: 1; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 0;
  background-color: #111; /* Black */
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 20px;
  padding-left:20px;
}
.sidenav i {
	color:white;
}

/* The navigation menu links */
.sidenav a {
  padding: 6px 8px 6px 16px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  display: block;
}

/* When you mouse over the navigation links, change their color */
.sidenav a:hover {
  color: #f1f1f1;
}

/* Style page content */
.main {
  margin-left: 50px; /* Same as the width of the sidebar */
  padding: 0px 10px;
}

/* On smaller screens, where height is less than 450px, change the style of the sidebar (less padding and a smaller font size) */
@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}
</style>
