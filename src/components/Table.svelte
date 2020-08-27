<script>

  import { beforeUpdate, afterUpdate, onMount } from 'svelte';
  let tickets = [];
  export let params;

const getID = async () => {
  try {
    return params.id;
  } catch (e) {
    console.log(e);
  }
};
  onMount(async () => {
    let myId = await getID();
    const tLayoutJson = await fetch(`https://chi2.f4food.net/home2/getKitchen/`+myId);
    let tLayoutJSON2 = await tLayoutJson.json();
    tickets = tLayoutJSON2.tickets;
  })

</script>
<div class="row" style="margin-left:180px">
  <a style="margin-top:50px;display:block" href="/" >TAKE ME HOME</a>

<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Date</th>
      <th scope="col">Total</th>
      <th scope="col">Balance</th>
      <th scope="col">isPaid</th>

    </tr>
  </thead>
  <tbody>
    {#each tickets as ticket}
    <tr>
      <th scope="row">{ticket.Id}</th>
      <td>{ticket.Date}</td>
      <td>{ticket.TotalAmount}</td>
      <td>{ticket.RemainingAmount}</td>
      <td><span class="badge badge-pill badge-primary">Primary</span></td>
    </tr>
    {/each}
  </tbody>
</table>
</div>
