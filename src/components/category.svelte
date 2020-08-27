<script>
    export let db;
    import { onMount } from 'svelte';
    import { currentCat } from '../stores.js';
	import { loggedIn, DepartmentId } from '../stores.js';

    let btnArray = ["danger","success","warning"]

    let category = [];
    let myData;
	function setCat(id) {
        //alert (id);
        currentCat.set(id);
    }
    $: onLogin($loggedIn);
    $: setCats($DepartmentId);

    function onLogin(state) {
        if (state)
            currentCat.set(category[3]['GroupCode'])
        loggedIn.set(false);

    }
    async function setCats(dept) {
       
        myData = await db.category.where("DepartmentId").equals(dept.toString()).toArray();
        category = myData;
        currentCat.set(category[0]['GroupCode'])
    }
    onMount(async () => {
        setCats($DepartmentId);
	});
</script>
{#each category as cat}
<button class="catButton btn btn-{btnArray[Math.floor(Math.random() * btnArray.length)]}" on:click="{() => setCat(cat.GroupCode)}">
	{cat.name}
</button>
{/each}
<style>
.catButton {
    width:100%;
    float:left;
    display:block;
    margin-bottom:5px;
}
</style>