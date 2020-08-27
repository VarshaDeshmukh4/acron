
<script>
  import { loggedIn,paidAmount } from '../stores.js';
  import { createEventDispatcher } from 'svelte';
  import { beforeUpdate, afterUpdate, onMount } from 'svelte';


	let pin = '';

  const dispatch = createEventDispatcher();
  export let onCloseTable;
  export let db;

	const select = num => () => pin += num;
  const clear  = () => pin = '';
	const submit  = () => pin = '';

	function submit1() {
    paidAmount.set(pin);
    new BSN.Modal('#payModal', { backdrop: true }).dispose();
    onCloseTable();
  }
  let loginPin = '';
  $: view = pin ? pin : 'enter your tender';
  onMount(async () => {
    let myNewModalInstance = new BSN.Modal('#payModal', { backdrop: true }).show();
    var myModal = document.getElementById('payModal');
        myModal.addEventListener('hidden.bs.modal', function(event){
          onCloseTable();
  });
})



</script>


<style>
	.keypad {
		display: grid;
		grid-template-columns: repeat(4, 5em);
		grid-template-rows: repeat(4, 3em);
		grid-gap: 0.5em
	}

	button {
		margin: 0
	}
</style>


<!-- Modal -->
<div class="modal fade" id="payModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div><h1>{view}</h1></div>

        <div class="keypad">
          <button on:click={select(1)}>1</button>
          <button on:click={select(2)}>2</button>
          <button on:click={select(3)}>3</button>
          <button class="btn btn-primary" on:click={select(7)}>CARD</button>
          <button on:click={select(4)}>4</button>
          <button on:click={select(5)}>5</button>
          <button on:click={select(6)}>6</button>
          <button class="btn btn-success" on:click={select(7)}>CASH</button>
          <button on:click={select(7)}>7</button>
          <button on:click={select(8)}>8</button>
          <button on:click={select(9)}>9</button>
          <button class="btn btn-danger"  on:click={select(7)}>DISCOUNT</button>
      
          <button disabled={!pin} on:click={clear}>clear</button>
          <button on:click={select(0)}>0</button>
          <button disabled={!pin} on:click={submit1}>submit</button>
          <button on:click={select(7)}>VOID</button>

        </div>
<!-- for better usage, wrap the tabs and contents -->

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>