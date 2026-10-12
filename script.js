// ===========================
// Elements
// ===========================

const description=document.getElementById("description");

const amount=document.getElementById("amount");

const date=document.getElementById("date");

const category=document.getElementById("category");

const type=document.getElementById("type");

const addBtn=document.getElementById("addBtn");

const transactionList=document.getElementById("transactionList");

const balance=document.getElementById("balance");

const income=document.getElementById("income");

const expense=document.getElementById("expense");

const search=document.getElementById("search");

// ===========================
// Variables
// ===========================

let transactions=[];

// ===========================
// Local Storage
// ===========================

function saveTransactions(){

localStorage.setItem(

"transactions",

JSON.stringify(transactions)

);

}

function loadTransactions(){

const saved=

localStorage.getItem("transactions");

if(saved){

transactions=JSON.parse(saved);

}

renderTransactions();

updateSummary();

}

loadTransactions();

// ===========================
// Add Transaction
// ===========================

function addTransaction(){

if(

description.value.trim()==="" ||

amount.value==="" ||

date.value===""

){

alert("Please fill all fields.");

return;

}

transactions.unshift({

id:Date.now(),

description:description.value,

amount:Number(amount.value),

date:date.value,

category:category.value,

type:type.value

});

saveTransactions();

renderTransactions();

updateSummary();

clearForm();

}

// ===========================
// Button
// ===========================

addBtn.addEventListener(

"click",

addTransaction

);

// ===========================
// Clear Form
// ===========================

function clearForm(){

description.value="";

amount.value="";

date.value="";

category.selectedIndex=0;

type.selectedIndex=0;

}

// ===========================
// Summary
// ===========================

function updateSummary(){

let totalIncome=0;

let totalExpense=0;

transactions.forEach(item=>{

if(item.type==="income"){

totalIncome+=item.amount;

}

else{

totalExpense+=item.amount;

}

});

income.textContent=

`₹${totalIncome.toFixed(2)}`;

expense.textContent=

`₹${totalExpense.toFixed(2)}`;

balance.textContent=

`₹${(totalIncome-totalExpense).toFixed(2)}`;

}
// ===========================
// Render Transactions
// ===========================

function renderTransactions(){

transactionList.innerHTML="";

transactions.forEach((item,index)=>{

const li=document.createElement("li");

li.className=item.type;

li.innerHTML=`

<div>

<h3>${item.description}</h3>

<p>

${item.category} • ${item.date}

</p>

</div>

<div>

<h3>

${item.type==="income" ? "+" : "-"}

₹${item.amount.toFixed(2)}

</h3>

</div>

<div class="actions">

<button class="edit">

✏ Edit

</button>

<button class="delete">

🗑 Delete

</button>

</div>

`;

transactionList.appendChild(li);

// Edit

li.querySelector(".edit").addEventListener("click",()=>{

editTransaction(index);

});

// Delete

li.querySelector(".delete").addEventListener("click",()=>{

deleteTransaction(index);

});

});

}

// ===========================
// Delete Transaction
// ===========================

function deleteTransaction(index){

if(confirm("Delete this transaction?")){

transactions.splice(index,1);

saveTransactions();

renderTransactions();

updateSummary();

}

}

// ===========================
// Edit Transaction
// ===========================

function editTransaction(index){

const item=transactions[index];

description.value=item.description;

amount.value=item.amount;

date.value=item.date;

category.value=item.category;

type.value=item.type;

transactions.splice(index,1);

saveTransactions();

renderTransactions();

updateSummary();

}

// ===========================
// Refresh
// ===========================

renderTransactions();
// ===========================
// Live Search
// ===========================

search.addEventListener("input",()=>{

const value=search.value.toLowerCase();

const items=document.querySelectorAll("#transactionList li");

items.forEach(item=>{

const text=item.textContent.toLowerCase();

if(text.includes(value)){

item.style.display="flex";

}

else{

item.style.display="none";

}

});

});

// ===========================
// Filter by Category
// ===========================

const filter=document.createElement("select");

filter.innerHTML=`

<option value="all">All Categories</option>

<option value="Food">Food</option>

<option value="Travel">Travel</option>

<option value="Shopping">Shopping</option>

<option value="Bills">Bills</option>

<option value="Entertainment">Entertainment</option>

<option value="Salary">Salary</option>

<option value="Other">Other</option>

`;

filter.style.marginBottom="20px";

filter.style.padding="12px";

filter.style.borderRadius="10px";

filter.style.border="none";

document.querySelector(".container").insertBefore(

filter,

transactionList

);

filter.addEventListener("change",()=>{

const value=filter.value;

const items=document.querySelectorAll("#transactionList li");

items.forEach((item,index)=>{

if(

value==="all" ||

transactions[index].category===value

){

item.style.display="flex";

}

else{

item.style.display="none";

}

});

});

// ===========================
// Empty State
// ===========================

function showEmptyState(){

if(transactions.length===0){

transactionList.innerHTML=`

<div class="empty-state">

<h2>💰 No Transactions</h2>

<p>

Add your first income or expense.

</p>

</div>

`;

}

}

const oldRender=renderTransactions;

renderTransactions=function(){

oldRender();

showEmptyState();

};

// ===========================
// Keyboard Shortcut
// Ctrl + Enter = Add Transaction
// ===========================

document.addEventListener("keydown",(event)=>{

if(event.ctrlKey && event.key==="Enter"){

event.preventDefault();

addTransaction();

}

});

// ===========================
// Refresh
// ===========================

renderTransactions();
// ===========================
// Chart
// ===========================

const ctx = document
.getElementById("expenseChart")
.getContext("2d");

let expenseChart = null;

function updateChart(){

const categories={};

transactions.forEach(item=>{

if(item.type==="expense"){

categories[item.category]=

(categories[item.category]||0)+item.amount;

}

});

const labels=Object.keys(categories);

const values=Object.values(categories);

if(expenseChart){

expenseChart.destroy();

}

expenseChart=new Chart(ctx,{

type:"doughnut",

data:{

labels:labels,

datasets:[{

data:values,

backgroundColor:[

"#ef4444",

"#22c55e",

"#3b82f6",

"#f59e0b",

"#8b5cf6",

"#14b8a6",

"#ec4899"

]

}]

},

options:{

responsive:true,

plugins:{

legend:{

labels:{

color:"#ffffff"

}

}

}

}

});

}

// ===========================
// Improve Summary
// ===========================

const oldSummary=updateSummary;

updateSummary=function(){

oldSummary();

updateChart();

};

// ===========================
// Export CSV
// ===========================

function exportCSV(){

if(transactions.length===0){

alert("No transactions to export.");

return;

}

let csv=

"Description,Amount,Date,Category,Type\n";

transactions.forEach(item=>{

csv+=

`${item.description},${item.amount},${item.date},${item.category},${item.type}\n`;

});

const blob=new Blob(

[csv],

{type:"text/csv"}

);

const url=

URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;

a.download="transactions.csv";

a.click();

URL.revokeObjectURL(url);

}

// ===========================
// Export Button
// ===========================

const exportBtn=document.createElement("button");

exportBtn.textContent="📤 Export CSV";

exportBtn.style.marginTop="20px";

exportBtn.style.padding="12px 18px";

exportBtn.style.border="none";

exportBtn.style.borderRadius="10px";

exportBtn.style.background="#2563eb";

exportBtn.style.color="#ffffff";

exportBtn.style.cursor="pointer";

exportBtn.style.fontWeight="600";

document.querySelector(".container")

.appendChild(exportBtn);

exportBtn.addEventListener(

"click",

exportCSV

);

// ===========================
// Initialize
// ===========================

updateSummary();

renderTransactions();