<script>
    export let db;
    import { onMount } from 'svelte';
	import { currentCat, loginProcess } from '../stores.js';
	import { cartProducts, DepartmentId } from '../stores.js';
    let mainProducts = [];
    let portionDisplay = false;
    let products = [];
    let myProds = [];
    let btnArray = ["danger","success","warning"]
    let multProducts = [];
    let oldMulti = [];
    $: getProducts($currentCat);

    let photos = [];
    onMount(async () => {
		//const res = await fetch(`https://chi2.f4food.net/home2/getMapingCategoryByDept`);
		//category = await res.json();
    });
    async function getProducts(id) {
        portionDisplay = false;
        if (id == 0)
            return false;
     
        let productsLoop = await db.products.where('[DeptId+GroupCode]').equals([$DepartmentId.toString(), id.toString()]).toArray();
        
        let checkProducts = [];
        let newProducts = [];
        let k;
        for (k in productsLoop) {
            if (checkProducts.includes(productsLoop[k].Id) === false) {
                checkProducts.push(productsLoop[k].Id);
                newProducts.push(productsLoop[k]);
            } else {
                multProducts.push(productsLoop[k].Id)
            }
        }
        
        products = newProducts;
       
    }
    async function showPortion(itemId) {
        currentCat.set(0);
        mainProducts = JSON.parse(JSON.stringify(products));
        let productsLoop = await db.products.where('[DeptId+Id]').equals([$DepartmentId, itemId.toString()]).toArray();
        oldMulti = JSON.parse(JSON.stringify(multProducts));
        multProducts = [];
        products = productsLoop;
        portionDisplay = true;

        
    }
    function addProductToCart(cat) {
        loginProcess.set([]);
        myProds = $cartProducts;
        let newItem =JSON.parse(JSON.stringify(cat));
        newItem.quantity = 1;
        myProds.push(newItem);
        cartProducts.set(myProds);

    }
    function backToMain() {
        portionDisplay = false;
        multProducts = oldMulti;
        console.log(mainProducts);

        products = mainProducts;

    }
</script>
{#if portionDisplay === true}
<button class="catButton btn btn-danger" on:click="{() => backToMain()}">Go back</button>
{/if}
{#each products as cat}
{#if multProducts.includes(cat.Id) === false}
<button class="catButton btn btn-{btnArray[Math.floor(Math.random() * btnArray.length)]}" on:click="{() => addProductToCart(cat)}">
    {cat.Name}
</button>
{:else}   
<button class="catButton btn btn-{btnArray[Math.floor(Math.random() * btnArray.length)]}" on:click="{() => showPortion(cat.Id)}">
    {cat.Name}
</button>
{/if}
{/each}
<style>
.catButton {
    width:31%;
    height:9vh;
    float:left;
    display:block;
    margin-right: 5px;
    margin-top: 5px;
}
</style>