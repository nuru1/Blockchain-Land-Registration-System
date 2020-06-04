//var Utils = require("./web3-utils");
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  SurveyNumber: 0,
  Owner: '0x0',
  buyer: '0x0',
  landInstance: null,
  
  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("LandRegistry.json", function(land) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.LandRegistry = TruffleContract(land);
      // Connect provider to interact with contract
      App.contracts.LandRegistry.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.LandRegistry.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.OwnerRegistration({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      })
    });
  },

  render: function() {
    var loader = $("#loader");
    var content = $("#content");
    var _SearchSurvey = $("#Search_SurveyNo");
    var _RegisterLand = $("#RegisterLand");

    _SearchSurvey.hide();
    _RegisterLand.hide();
    loader.show();
    content.hide();
    $('#LandRegistrationDiv').hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        App.Owner = account;
        console.log("Account "+App.account);
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.LandRegistry.deployed().then(function(instance) {
      App.landInstance = instance;
      
      instance.CheckUser({from: App.account}).then(function(RegisteredUser){
       console.log("check user "+RegisteredUser);
       loader.hide();
       _RegisterLand.show();
       if(RegisteredUser){
        _SearchSurvey.show();
       }else{
       
        }
      })
    }).catch(function(error) {
      console.warn(error);
    });
  },
  
  RegisterLand: function(){
    $("#Search_SurveyNo").hide();
    $("#RegisterLand").hide();
    $('#LandRegistrationDiv').show();
    $('#content').hide();
    console.log('Register Land Now....');
  },

  RegisterNewLand: function(){
    var _SurveyNum = $('#RegSurveyNo').val();
    var _TotalArea = $('#RegTotalArea').val();
    var _City = $('#RegCity').val();
    var _RevenueDiv = $('#RegRevDiv').val();
    var _Mandal = $('#RegMandal').val();
    var _District = $('#RegDistrict').val();
    var _State = $('#RegState').val();
    var _Name = $('#RegName').val();
    var _GName = $('#RegGName').val();
    var _Aadhar = $('#RegAadhar').val();
    var _Cost = $('#RegCost').val();
    var _PAN = $('#RegPAN').val();
    var _Date = $('#RegDate').val();
    
    if(_SurveyNum== '' || _TotalArea== '' || _City== '' || _RevenueDiv== '' || _Mandal== '' || _District== '' || _State== '' || _Name=='' || _GName=='' || _Aadhar== '' || _Cost== '' || _PAN== '' || _Date== ''){
      window.alert('Please enter all the fields!');
    }else{
      console.log('registering your land.....');
      App.contracts.LandRegistry.deployed().then(function(instance){
        return instance.RegisterLand(_SurveyNum,_TotalArea,_City,_RevenueDiv,_Mandal,_District,_State,_Name,_GName,_Aadhar,_PAN,_Cost,_Date);
      }).catch(function(error) {
        console.warn(error);
      });
    }
  },

  SearchSurveyNo: function(){
    $('#OwnerDetails').hide();
    $('#LandDetails').hide();
    $('#LandControl').hide();
    $('#LandControl').hide();
    $('#LandControlBtn').show();
    $('#LandControlForm').hide();

    var SurvyNo = $('#SurveyNumber').val();
    if(SurvyNo != ''){
      App.contracts.LandRegistry.deployed().then(function(instance){
        $('#loader').show();
        return instance.getOwnerAddress(SurvyNo);
      }).then(function(result){
          console.log(result);
          if(result == App.account){
            App.contracts.LandRegistry.deployed().then(function(instance){
              return instance.getLandDetails(SurvyNo);
            }).then(function(res){
                console.log(res);
                App.LandDetails(res);
            }).catch(function(error) {
                console.warn(error);
              });
          }else{
            $('#loader').hide();
            console.log('Survey number not found');
          }
      }).catch(function(error) {
        $('#loader').hide();
        console.warn(error);
        window.alert('Survey number is not registered with your address');
      });
    }
    console.log(SurvyNo);
  },

  LandDetails: function(Details){
    $('#loader').hide();
    $('#LandResults').empty();
    App.SurveyNumber = Details[0].c[0];
    var data= "<tr><td>"+Details[0].c[0]+"</td> <td>"+Details[1].c[0]+"</td> <td>"+Details[2]+"</td> <td>"+Details[3]+"</td> <td>"+Details[4]+"</td> <td>"+Details[5]+"</td> <td>"+Details[6]+"</td> </tr>"
    //console.log(data);
    $('#LandResults').append(data);
    $('#content').show();
    $('#LandDetails').show();
    $('#OwnerDetailsDiv').show();
    $('#LandControl').show();
  },
  getOwnerDetails: function(){
    var OwnerCount;
    //console.log(App.SurveyNumber);
    $('#loader').show();
    App.contracts.LandRegistry.deployed().then(function(instance){
      return instance.getOwnerCount(App.SurveyNumber);
    }).then(function(result){
      OwnerCount = result.c[0];
      console.log('Owner Count: '+ OwnerCount);
      if(OwnerCount>=0){
        App.contracts.LandRegistry.deployed().then(function(instance){
          return instance.getOwnerDetails(App.SurveyNumber,OwnerCount-1);
        }).then(function(data){
          console.log(data);
          App.FillOwnerDetails(data,OwnerCount);
        });
      }
    }).catch(function(error) {
      $('#loader').hide();
      console.warn(error);
    });
  },
  FillOwnerDetails: function(Details,OwnerCount){
    $('#OwnerDetailsDiv').hide();
    $('#OwnerResults').empty();
    var data = "<tr> <td>"+Details[0]+"</td> <td>"+Details[1]+"</td> <td>"+Details[2].c[0]+"</td> <td>"+Details[3]+"</td> <td>"+Details[4].c[0]+"</td> <td>"+Details[5]+"</td> </tr>";
    //console.log(data);
    $('#OwnerResults').append(data);
    $('#OwnerDetails').show();
    $('#loader').hide();
    if(OwnerCount>1) 
      $('#MoreDetailsDiv').show();
  },
  LandControl: function(){
    $('#LandControl').show();
    $('#LandControlBtn').hide();
    $('#LandControlForm').show();
  },
  SellLand: function(){
    if(web3.eth.accounts[0] != App.account){
      window.alert('Please change the account to owner\'s account in metamask');
      return;
    }
    var _address = $('#SellAddress').val().toString();
    var _Name = $('#SellName').val();
    var _GName = $('#SellGName').val();
    var _Aadhar = $('#SellAadhar').val();
    var _Cost = $('#SellCost').val();
    var _PAN = $('#SellPAN').val();
    var _Date = $('#SellDate').val();
    //console.log(_address+" "+_Name+" "+_GName+ " "+App.account);
    if(_address ==''|| _Name ==''|| _GName ==''|| _Aadhar ==''|| _Cost==''|| _PAN ==''|| _Date ==''){
      window.alert("Please fill all details");
    }else{
      App.contracts.LandRegistry.deployed().then(function(instance){
        instance.RegisterOwner(App.SurveyNumber,_Name,_GName,_Aadhar,_PAN,_Cost,_Date,App.buyer);
      }).catch(function(error) {
        $('#loader').hide();
        console.warn(error);
      });
    }
  },
  getAddress: function(){
    var acc = web3.eth.accounts[0];
    console.log('account '+acc);
    if(App.account == acc){
      window.alert('Please change account to buyer\'s account in metamask');
    }
    else{
      $('#SellAddress').val(acc);
      App.buyer=acc;
    }
  },
  getPrevoiusOwners: function(){
    $('#loader').show();
    App.contracts.LandRegistry.deployed().then(function(instance){
      App.landInstance = instance;
      return instance.getOwnerCount(App.SurveyNumber);
    }).then(function(result){
      var count = result.c[0];
      console.log('previous owners: '+count);
      App.FillPreviousOwners(count);
    }).catch(function(err){
      $('#loader').hide();
      console.warn(err);
    });
  },
  FillPreviousOwners: function(count){
    //var result=" ";
    $('#OwnerDetailsDiv').hide();
    $('#OwnerResults').empty();
    for(var i=count-1; i>=0; i--){
      App.landInstance.getOwnerDetails(App.SurveyNumber,i)
        .then(function(Details){
          var data = "<tr> <td>"+Details[0]+"</td> <td>"+Details[1]+"</td> <td>"+Details[2].c[0]+"</td> <td>"+Details[3]+"</td> <td>"+Details[4].c[0]+"</td> <td>"+Details[5]+"</td> </tr>";
          //result+=data;
          $('#OwnerResults').append(data);
          console.log(Details);
        });
    }
    //console.log(result);
    $('#OwnerDetails').show();
    $('#loader').hide();
    $('#MoreDetailsDiv').hide();
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
