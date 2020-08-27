<script context="module">
     export async function saveOrderCart() {
       

    }
</script>
<script>
    export let db;
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    import { onMount } from 'svelte';
    import { cartProducts, cartTotal, paidAmount, currentUser } from '../stores.js';
    let myProds = [];
    let amendedProducts = [];

    let products = [];
    $: amendCart($cartProducts);

    let photos = [];
    onMount(async () => {
		
    });
    async function getProducts(id) {
        if (id == 0)
            return false;
        products = await db.products.where({GroupCode: id.toString()}).toArray();
       
    }
    function quantityAction(action,index) {
     console.log($currentUser);
        if (action == 'remove') {
            myProds = $cartProducts;
            myProds.splice(index,1);
            cartProducts.set(myProds);
        } else if (action =='add') {
          $cartProducts[index].quantity =  $cartProducts[index].quantity+1;


        }
    }
    function editItem(action,theItem,index) {
      dispatch('message', {
      action: 'edit',
      item: theItem,
			index,

		});
    }
    function amendCart(cartProducts) {
      let i;
      let newTotal = 0;
      for (i in cartProducts) {
        newTotal += cartProducts[i].price *  cartProducts[i].quantity;
        if (typeof cartProducts[i].modifiers !== 'undefined') {
          let k;
          cartProducts[i].modifiersDisplayed = '';
          for (k in cartProducts[i].modifiers) {
            cartProducts[i].modifiersDisplayed += "<br>" + cartProducts[i].modifiers[k].tagQty + " X " + cartProducts[i].modifiers[k].TagName
          } 
        } else {
          cartProducts[i].modifiersDisplayed ='';
        }
      }
      amendedProducts = cartProducts;
      cartTotal.set(newTotal);
    }


    
</script>

<tbody>
    {#each amendedProducts as cat,i}
    <tr>
      <td class="w-25">
        <img src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/vans.png" class="img-fluid img-thumbnail" alt="Sheep">
      </td>
      <td>{cat.quantity} x {cat.Name} - {@html cat.modifiersDisplayed}</td>
      <td>{cat.price}</td>
      <td class="qty">
        <i class="fa fa-pencil"  on:click="{() => editItem('edit',cat,i)}"></i>
        <i class="fa fa-plus"   on:click="{() => quantityAction('add',i)}"></i>
        
      </td>
      <td>{cat.price * cat.quantity}</td>
      <td>
        <a href="#" class="btn btn-danger btn-sm">
          <i class="fa fa-times" on:click="{() => quantityAction('remove',i)}"></i>

        </a>
      </td>
    </tr>
    {/each}
  </tbody>
<style>
.catButton {
    width:100%;
    float:left;
    display:block;
}
a:visited {
  color:white;
}
</style>