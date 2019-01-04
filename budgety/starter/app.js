/*
Using Immediately Invoked Function Expression to build the data controller module.
*/
let budgetController=(function(){
   //Data model for expenses.Function Consructor for Expenses.
    let Expense=function(expenseId,expenseDescription,expenseValue){
        this.id=expenseId;
        this.expenseDescription=expenseDescription;
        this.expenseValue=expenseValue;
        this.percentage=-1;
    };
    
    Expense.prototype.calcPercentage=function(totalIncome){
        if(totalIncome!==0){
            this.percentage=Math.round(100*(this.expenseValue/totalIncome));
        }
        else{
            this.percentage=-1;
        }
    
    };
    
    Expense.prototype.getPercentage=function(){
        return this.percentage;
    };
    
    //Data model for Income.Function Consructor for Income.
    let Income=function(incomeId,incomeDescription,incomeValue){
        this.id=incomeId;
        this.incomeDescription=incomeDescription;
        this.incomeValue=incomeValue;
    };
    
    let calculateTotal=function(type){
        let sum=0;
        let arrayToWorkOn;
        if(type==='inc'){
            arrayToWorkOn=data.allItems.incomeArray;
            arrayToWorkOn.forEach(function(current){
                sum+=current.incomeValue;
            });
            data.totals.totalIncome=sum;
        }else if(type==='exp'){
            arrayToWorkOn=data.allItems.expenseArray;
            arrayToWorkOn.forEach(function(current){
                sum+=current.expenseValue;
            });
            data.totals.totalExpense=sum;
        }
    
    };
    
    let data={
        allItems: {
         //To Track all Income.
         incomeArray: [], 
         //To Track all Expenses.
         expenseArray: []
        },
        totals: {
            totalIncome: 0,
            totalExpense: 0
        },
        
        budget: 0,
        
        percentage: -1
    };
    
    return {
        addItem: function(type, des, val){
            let newItem;
            let arrayToPush;
            // if type is income/inc.
            if(type === 'inc'){
                arrayToPush=data.allItems.incomeArray;
                //creating income item.
                let id=0
                if(arrayToPush.length!==0){
                    id=arrayToPush[arrayToPush.length-1].id+1;
                }
                newItem=new Income(id,des,val);
                arrayToPush.push(newItem);
            }
            // if type is expense/exp.
            else if(type === 'exp'){
                arrayToPush=data.allItems.expenseArray;
                //creating expense item.
                let id=0
                if(arrayToPush.length!==0){
                    id=arrayToPush[arrayToPush.length-1].id+1;
                }
                newItem=new Expense(id,des,val);
                arrayToPush.push(newItem);
            }
            //return item newly created.
            return newItem;
            
        },
        
        calculateBudget: function(){
            calculateTotal('inc');
            calculateTotal('exp');
            data.budget=data.totals.totalIncome-data.totals.totalExpense;
            if(data.totals.totalIncome!==0){
            data.percentage=100*(data.totals.totalExpense/data.totals.totalIncome);
            }
            else{
            data.percentage=-1;  
            }
            },
        
        calculatePercentage: function(){
            calculateTotal('inc');
            let totalIncome=data.totals.totalIncome;
            data.allItems.expenseArray.forEach(function(current){
                current.calcPercentage(totalIncome);
            });
            },
        getPercentages: function(){
            var percentageArray=data.allItems.expenseArray.map(function(current){
                return current.getPercentage();
;
            });
            
            return percentageArray;
        },
        getBudget: function(){
            return{
              budget: data.budget,
              percentage: data.percentage,
              totalExpense: data.totals.totalExpense,
              totalIncome: data.totals.totalIncome
            };
        },
        
        deleteItem: function(type,id){
          if(type==='inc'){
              var ids=data.allItems.incomeArray.map(function(current){
                  return current.id;
              });
              index=ids.indexOf(id);
              if(index!==-1){
                  data.allItems.incomeArray.splice(index,1);
              }
          }else if(type==='exp'){
               data.allItems.expenseArray.map(function(current){
                  return current.id;
              });
              index=ids.indexOf(id);
              if(index!==-1){
                  data.allItems.expenseArray.splice(index,1);
              }
        }
    }
    };
   
    
    
})();

/*
Using Immediately Invoked Function Expression to build the UI controller module.
*/
let uiController=(function(){
    //A common Object containing access keys to DOM.
    var DOMStrings={
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputButton: '.add__btn',
      incomeContainer: '.income__list',
      expenseContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel:'.budget__income--value',
      expenseLabel: '.budget__expenses--value',
      percentageLabel: '.budget__expenses--percentage',
      parentContainer: '.container',
      percLabel:'.item__percentage',
      dateLabel:'.budget__title--month'    
    };
    var formatter=function(num, type){
            var numSplit,int, dec;
            
            num=Math.abs(num);
            num=num.toFixed(2);
            numSplit=num.split('.');
            int=numSplit[0];
            dec=numSplit[1];
            if(int.length>3){
                int=int.substr(0,int.length-3)+','
                +int.substr(int.length-3,3);
            }
            return ((type==='exp'?'-':'+')+int+'.'+dec);
        };
    
    var nodeListForEach=function(allPercentagesLabels,callBack){
                for(let i=0;i<allPercentagesLabels.length;i++){
                    callBack(allPercentagesLabels[i],i);
                }
            };
    return{
        getInput: function(){
            //Income/Expense i.e. inc/exp i.e. +/-.
            let type = document.querySelector(DOMStrings.inputType).value;
            //Description reading.
            let description = document.querySelector(DOMStrings.inputDescription).value;
            //Value reading.
            let value=parseFloat(document.querySelector(DOMStrings.inputValue).value);
            //returning the input read as an anonymouus object.
            return {
                type: type,
                description: description,
                value: value
            };
        
    },
        getDomStrings: function(){
            return DOMStrings;
        },
        
        addListItem: function(newItem,type){
            //Create an Html string with placeholder text.
            let html,newHtml, elementToPlunge;
            if(type==='inc'){
                html='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">                                  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                //Replace placeholder with original data.
            newHtml=html.replace('%id%',newItem.id);
            newHtml=newHtml.replace('%description%',newItem.incomeDescription);
            newHtml=newHtml.replace('%value%',formatter(newItem.incomeValue,'inc'));
            elementToPlunge=document.querySelector(DOMStrings.incomeContainer);
            }
            else{
                html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                //Replace placeholder with original data.
            newHtml=html.replace('%id%',newItem.id);
            newHtml=newHtml.replace('%description%',newItem.expenseDescription);
            newHtml=newHtml.replace('%value%',formatter(newItem.expenseValue,'exp'));
            elementToPlunge=document.querySelector(DOMStrings.expenseContainer);
            
            }
            
            //insert the html to DOM.
            elementToPlunge.insertAdjacentHTML('beforeend',newHtml);
            
            
        },
        
        clearFields: function(){
            let fields=document.querySelectorAll(DOMStrings.inputDescription+','+ DOMStrings.inputValue);

            let fieldsArray=Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current, index, array){
                    current.value="";
            });
            fieldsArray[0].focus();
        },
        
        displayBudget: function(obj){
            var type;
           obj.budget>0 ? type='inc':type='exp'; document.querySelector(DOMStrings.budgetLabel).textContent=formatter(obj.budget,type);
            document.querySelector(DOMStrings.incomeLabel).textContent=formatter(obj.totalIncome,'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent=formatter(obj.totalExpense,'exp');
            if(obj.percentage!=-1){
                document.querySelector(DOMStrings.percentageLabel).textContent=Math.round(obj.percentage)+'%';
            }
            else{
                document.querySelector(DOMStrings.percentageLabel).textContent='-';
            }
            
        },
        
        deleteItem: function(item){
            item.parentNode.removeChild(item);
        },
        
        displayPercentage: function(percentageDetails){
            let allPercentagesLabels=document.querySelectorAll(DOMStrings.percLabel);
            
            nodeListForEach(allPercentagesLabels,function(current,index){
                if(percentageDetails[index]!==-1){
                    current.textContent=percentageDetails[index]+'%';
                }
                else{
                    current.textContent='-';
                }
                
            });
            
        },
        
        displayMonth:function(){
        var now=new Date();
        var year =now.getFullYear();
        var month=now.getMonth();
        var months=['January','February','March',
        'April','May','June','July','August','September','October','November','December']
        document.querySelector(DOMStrings.dateLabel).textContent=months[month] + ' '+year;
    },
        
        changedType: function(){
            var fields=document.querySelectorAll(
                DOMStrings.inputType+','+
                DOMStrings.inputDescription+','+
                DOMStrings.inputValue
            );
            nodeListForEach(fields,function(current){
                current.classList.toggle('red-focus');
            });
            
            document.querySelector(DOMStrings.inputButton).classList.toggle('red');
        }
        
        
    };
})();

/*
Using Immediately Invoked Function Expression to build the event controller module.
EventController has access to  data/Ui controller i.e. based on some action certain things have to change in the data n ui controller.
*/
let eventController=(function(budgetCtrl,uiCtrl){
    /*
    Update budget.
    */
    let updateBudget=function(){
        //calculating all data.
        budgetCtrl.calculateBudget();
        //fetching current data.
        let currentBudgetDetails=budgetCtrl.getBudget();
        //display current budget.
        uiCtrl.displayBudget(currentBudgetDetails);
        
    };
    
     /*
    Update percentages.
    */
    let updatePercentage=function(){
        //calculating all data.
        budgetCtrl.calculatePercentage();
        //fetching current data.
        let currentPercentageDetails=budgetCtrl.getPercentages();
    
        //display current budget.
        uiCtrl.displayPercentage(currentPercentageDetails);
        
    };
    /*
    This function enables us to do what should be done on click of add and also press of enter key.
    */
    let ctrlAddItem=function(){
        let userInput, newItem;
      //1. Get Input field Data.
        userInput=uiCtrl.getInput();
      //2. Add the item to budget/data controller.
       if(userInput.description!=="" && !isNaN(userInput.value) && userInput.value!=0){
           newItem=budgetCtrl.addItem(userInput.type,userInput.description,userInput.value);
      //3. Add the item to the UI.
        uiCtrl.addListItem(newItem,userInput.type);
      //3.5 Clear fields.
         uiCtrl.clearFields();
      //4. Calculate current budget.
      //5. Make corresponding Changes to UI.
           updateBudget();
        //update perentage.
        updatePercentage();
       }
    }
    
    /*
    Deletion of item.
    */
    let ctrlDeleteItem=function(event){
        var item,itemId,splitId,splitType,type;
        item=event.target.parentNode.parentNode.parentNode.parentNode;
        itemId=item.id;
        if(itemId){
            splitType=itemId.split('-')[0];
            splitId=itemId.split('-')[1];
            if(splitType==='income'){
                type='inc'
            }else if(splitType==='expense'){
                type='exp'
            }
        }
        
        //delete from data model.
        budgetCtrl.deleteItem(type,parseInt(splitId));
        //delete from ui.
        uiCtrl.deleteItem(item);
        //Update budget.
        updateBudget();
        
        //update perentage.
        updatePercentage();
    }
    
    let setUpEventListeners=function(){
    
        let DOMAccessors=uiCtrl.getDomStrings();
        //Clicking the add button.
        document.querySelector(DOMAccessors.inputButton).addEventListener('click',ctrlAddItem);
        
        //Pressing Enter will also work.
        document.addEventListener('keypress',function(event){
            //If enter was pressed.
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });
        
        //Deleting items.
        document.querySelector(DOMAccessors.parentContainer).addEventListener('click',ctrlDeleteItem);
        
        //to make user friendly.
        document.querySelector(DOMAccessors.inputType).addEventListener('change',uiCtrl.changedType);
    };
    
    return{
        init: function(){
            setUpEventListeners();
            uiCtrl.displayBudget({
              budget: 0,
              percentage: -1,
              totalExpense: 0,
              totalIncome: 0
            });
            uiCtrl.displayMonth();
        }
        
    }
   
})(budgetController,uiController);

eventController.init();