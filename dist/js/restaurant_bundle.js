class DBHelper{static get DATABASE_URL(){return"http://127.0.0.1:1337/restaurants"}static fetchRestaurants(e){fetch(this.DATABASE_URL).then(e=>e.json()).then(t=>{return e(null,t)})}static fetchRestaurantById(e,t){DBHelper.fetchRestaurants((n,a)=>{if(n)t(n,null);else{const n=a.find(t=>t.id==e);n?t(null,n):t("Restaurant does not exist",null)}})}static fetchRestaurantByCuisine(e,t){DBHelper.fetchRestaurants((n,a)=>{if(n)t(n,null);else{const n=a.filter(t=>t.cuisine_type==e);t(null,n)}})}static fetchRestaurantByNeighborhood(e,t){DBHelper.fetchRestaurants((n,a)=>{if(n)t(n,null);else{const n=a.filter(t=>t.neighborhood==e);t(null,n)}})}static fetchRestaurantByCuisineAndNeighborhood(e,t,n){DBHelper.fetchRestaurants((a,r)=>{if(a)n(a,null);else{let a=r;"all"!=e&&(a=a.filter(t=>t.cuisine_type==e)),"all"!=t&&(a=a.filter(e=>e.neighborhood==t)),n(null,a)}})}static fetchNeighborhoods(e){DBHelper.fetchRestaurants((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].neighborhood),a=t.filter((e,n)=>t.indexOf(e)==n);e(null,a)}})}static fetchCuisines(e){DBHelper.fetchRestaurants((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].cuisine_type),a=t.filter((e,n)=>t.indexOf(e)==n);e(null,a)}})}static urlForRestaurant(e){return`./restaurant.html?id=${e.id}`}static imageUrlForRestaurant(e){return`/img/${e.photograph}`}static mapMarkerForRestaurant(e,t){return new google.maps.Marker({position:e.latlng,title:e.name,url:DBHelper.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP})}static restaurantIsFavorite(e,t){fetch(`http://localhost:1337/restaurants/${e}/?is_favorite=true`,{method:"PUT"}).then(()=>{console.log("its your favorite")})}static restaurantNotFavorite(e,t){fetch(`http://localhost:1337/restaurants/${e}/?is_favorite=false`,{method:"PUT"}).then(()=>{console.log("not your favorite")})}static fetchRestaurantReviews(e,t){fetch(`http://localhost:1337/reviews/?restaurant_id=${e}`).then(e=>e.json()).then(e=>{return t(null,e)})}static sendRestaurantReview(e,t,n,a,r){const s={restaurant_id:e,name:t,rating:n,comments:a};fetch("http://localhost:1337/reviews/",{headers:{"Content-Type":"application/form-data"},method:"POST",body:JSON.stringify(s)}).then(()=>{console.log("updated")})}}let restaurant;var map;window.initMap=(()=>{fetchRestaurantFromURL((e,t)=>{e?console.error(e):(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:t.latlng,scrollwheel:!1}),fillBreadcrumb(),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map))})});const fetchRestaurantFromURL=e=>{if(self.restaurant)return void e(null,self.restaurant);const t=getParameterByName("id");t?DBHelper.fetchRestaurantById(t,(t,n)=>{self.restaurant=n,n?(fillRestaurantHTML(),e(null,n)):console.error(t)}):(error="No restaurant id in URL",e(error,null))},fillRestaurantHTML=(e=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;const t=document.getElementById("restaurant-img");t.className="restaurant-img",t.src=`/images/${e.id}-270.jpg`,t.alt="An image of the restaurant "+e.name,t.srcset=`/images/${e.id}-270.jpg 300w, /images/${e.id}-600.jpg 600w`,document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&fillRestaurantHoursHTML(),DBHelper.fetchRestaurantReviews(e.id,fillReviewsHTML)},fillRestaurantHoursHTML=(e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const a=document.createElement("tr"),r=document.createElement("td");r.innerHTML=n,a.appendChild(r);const s=document.createElement("td");s.innerHTML=e[n],a.appendChild(s),t.appendChild(a)}},fillReviewsHTML=(e,t)=>{self.restaurant.reviews=t,console.log(self.restaurant.reviews);const n=document.getElementById("reviews-container"),a=document.createElement("div");a.className="reviewHeader",n.appendChild(a);const r=document.createElement("h2");r.innerHTML="Reviews",a.appendChild(r);const s=document.createElement("button");s.className="addReviewsButton",s.innerHTML="Add a Review",a.appendChild(s);const i=document.getElementById("addReviewModal"),o=document.getElementById("maincontent");if(s.addEventListener("click",e=>{i.style.display="block",o.style.opacity=".3"}),document.getElementById("cancelReview").addEventListener("click",e=>{e.preventDefault(),i.style.display="none",o.style.opacity="1"}),!t){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void n.appendChild(e)}const l=document.getElementById("reviews-list");t.forEach(e=>{l.appendChild(createReviewHTML(e))}),n.appendChild(l)},submitButton=document.getElementById("submitReview");submitButton.addEventListener("click",e=>{e.preventDefault();const t=document.getElementById("name").value,n=document.getElementById("rating").value,a=document.getElementById("comments").value;"serviceWorker"in navigator&&"SyncManager"in window&&navigator.serviceWorker.ready.then(e=>{var r={name:t,rating:n,comments:a},s=new Worker("./worker.js");navigator.serviceWorker.controller.postMessage({review:r,store:"reviews-sync-store",command:"sendReview"}),s.postMessage({review:r,store:"reviews-sync-store",command:"sendReview"}),s.onmessage=(t=>(console.log("syncing"),e.sync.register("send-review")))}),DBHelper.sendRestaurantReview(self.restaurant.id,t,n,a,(e,r)=>{e?console.log("Error saving review"):(console.log(r),console.log(t,n,a),window.location.href=`/restaurant.html?id=${self.restaurant.id}`)})}),createReviewHTML=(e=>{const t=document.createElement("li"),n=document.createElement("div");t.appendChild(n);const a=document.createElement("p");a.innerHTML=`Author: ${e.name}`,a.className="review-name",n.className="review-heading",n.appendChild(a);const r=document.createElement("p");reviewDate=new Date(e.createdAt),console.log(reviewDate),displayDate=`${reviewDate.getDay()}/${reviewDate.getDate()}/${reviewDate.getFullYear()}`,r.innerHTML=`Date: ${displayDate}`,r.className="review-date",n.appendChild(r);const s=document.createElement("div");s.className="review-info";const i=document.createElement("p");i.innerHTML=`Rating: ${e.rating}`,i.className="review-rating",t.appendChild(s),s.appendChild(i);const o=document.createElement("p");return o.innerHTML=`${e.comments}`,o.className="review-comment",s.appendChild(o),t}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),n=document.createElement("li");n.innerHTML=e.name,n.setAttribute("aria-current","page"),t.appendChild(n)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null}),"serviceWorker"in navigator&&navigator.serviceWorker.register("./sw.js").then(function(e){console.log("Registration succeeded. Scope is "+e.scope)}).catch(function(e){console.log("Registration failed with "+e)});