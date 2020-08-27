<script context="module">

    import { loggedIn, cartProducts } from '../stores.js';
  

 
    
    </script>
    <script>
    import { beforeUpdate, afterUpdate, onMount } from 'svelte';

    export let currentItem;
    export let currentModifiers;
    export let currentPortion;
    export let onClose;
    export let db;
    let myTagDisplay = [];
    let myGroups = [];
    let currGroups = {};
    let modState = true;
    let myNewModalInstance;
    let currTagQty = {};
    

    afterUpdate(() => {
      var myTabs = document.getElementById('myTabs2');

      // let's give the initialization a JavaScript reference for the "target" option
      var myTabsCollection = myTabs.getElementsByTagName('A');

      // initialize the component for all items in the collection
      Array.from(myTabsCollection).map(
      tab => new BSN.Tab( tab, {height: true} )
      );
    });
    onMount(async () => {
     
     
        let myTags = await db.tags.where({ItemID: currentPortion}).toArray();
        if (myTags.length == 0) {
          onClose();
          alert('Ayaiaiai alpha');
          return false;
        }
        myNewModalInstance = new BSN.Modal('#ModifierModal', { backdrop: true });
        myNewModalInstance.show();
        var myModal = document.getElementById('ModifierModal');
        myModal.addEventListener('hidden.bs.modal', function(event){
          myNewModalInstance.dispose();
          onClose();
            }, false);
        let k;
       
        let uniqueGroups = [];
        let uniqueTags = [];
        
        for (k in myTags) {
            if (uniqueGroups.includes(myTags[k].GroupId) === false) {
                myGroups.push(myTags[k]);
                uniqueGroups.push(myTags[k].GroupId);
                currGroups[myTags[k].GroupId] = [];
            }
            if (uniqueTags.includes(myTags[k].TagID) === false) {
                currTagQty[myTags[k].TagID] = 0;
                //console.log(currTagQty);
                myTagDisplay.push(myTags[k]);
                uniqueGroups.push(myTags[k].GroupId);

            }
            
        }
        if (typeof currentModifiers.item.modifiers !== 'undefined') {
          for (k in myTagDisplay) {
            let i;
            for (i in currentModifiers.item.modifiers) {
              if (currentModifiers.item.modifiers[i].TagID == myTagDisplay[k].TagID) {
                currTagQty[currentModifiers.item.modifiers[i].TagID] = currentModifiers.item.modifiers[i].tagQty;
                currGroups[myTagDisplay[k].GroupId].push(myTagDisplay[k].TagID);
                currGroups[myTagDisplay[k].GroupId] = currGroups[myTagDisplay[k].GroupId];
              }
              }

            }


        }
        myGroups = myGroups;
        myTagDisplay = myTagDisplay

      });
        async function saveModifiers() {
          let k;
          let currArray = [];
          for (k in currGroups) {
            currArray.push(currGroups[k]);
          }
          var merged = [].concat.apply([], currArray);
          let getNames = await db.tags.where('TagID').anyOf(merged).toArray();
          let uniqueNames = [];
          let currentNames = [];
          for (k in getNames) {
            if (uniqueNames.includes(getNames[k].TagID) === false) {
              getNames[k].tagQty = currTagQty[getNames[k].TagID];
              uniqueNames.push(getNames[k].TagID);
              currentNames.push(getNames[k]);
            }
          }
          let myCart = $cartProducts;
          myCart[currentItem].modifiers = currentNames;
          cartProducts.set(myCart);
          myNewModalInstance = new BSN.Modal('#ModifierModal', { backdrop: true });
          myNewModalInstance.hide();
          onClose();


        }
    $: updateChecks(currTagQty);
    async function updateChecks(parseQty) {
      console.log('ran once');
      let i;
      for (i in parseQty) {
        let getGroup = await db.tags.where('TagID').equals(i).first();
  
        if(parseQty[i] > 0) {
          currGroups[getGroup.GroupId].push(i);
          currGroups[getGroup.GroupId] = currGroups[getGroup.GroupId];
          currGroups = currGroups;
          currGroups[getGroup.GroupId] = currGroups[getGroup.GroupId].filter((v, i, a) => a.indexOf(v) === i); ;
        } else {
          let remove = currGroups[getGroup.GroupId].indexOf(i);
          if (remove !==  -1) {
            currGroups[getGroup.GroupId].splice(remove);
            currGroups[getGroup.GroupId] = currGroups[getGroup.GroupId];
            
          }

        }
      }
    }
  // $: console.log(currGroups);
   /*$: (async() => {
      let findGroups = currGroups;
      let getAll  = [];
      let k;
      for (k in findGroups) {
        getAll.push(findGroups[k]);
      }
      let merged = [].concat.apply([], getAll);
      for (k in currTagQty) {
        if (merged.includes(k) === false) {
          currTagQty.i = 0;
        } else if (currTagQty.i == 0) {
          currTagQty.i = 1;
          
        }

      }

      })();*/

      function checkItem(tag,state) {
        if (state === false) {
          currTagQty[tag] = 0;

        } else if (currTagQty[tag] == 0) {
          currTagQty[tag] = 1;
        }
      }

    
    </script>
    <!-- Modal -->
    <div class="modal fade" id="ModifierModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs" id="myTabs2" role="tablist">
                {#each myGroups as cat,i}
                <li class="nav-item">
                  <a class="nav-link {i == '0' ? 'active' : ''}" id="{cat.GroupId}" data-toggle="tab" href="#home-{cat.GroupId}" role="tab" aria-controls="home-{cat.GroupId}" aria-selected=" {i == '0' ? 'true' : 'false'}">{cat.GroupName}</a>
                </li>
                {/each}
                
  
              </ul>
              <div class="tab-content" id="myTabContent">
                {#each myGroups as cat,i}
                <div class="tab-pane fade {i == '0' ? 'active show' : ''}" id="home-{cat.GroupId}" role="tabpanel" aria-labelledby="{cat.GroupId}">
                    {#each myTagDisplay as tags}
                        {#if tags.GroupName == cat.GroupName}
                        <li>{tags.TagName} <input type=checkbox bind:group={currGroups[cat.GroupId]} value={tags.TagID} on:change={ e => { checkItem(e.target.value,e.target.checked) }}><input type=text bind:value={currTagQty[tags.TagID]}></li>

                        {/if}
                    {/each}
                    
                </div>
                {/each}
               
              
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" on:click={saveModifiers}>Save changes</button>
          </div>
        </div>
      </div>
    </div>