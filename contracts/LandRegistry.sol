pragma solidity >=0.4.21 <0.6.0;

contract LandRegistry{

    struct Land{
        uint surveyNo;
        uint TotalArea;
        string city;
        string Revenue_Div;
        string Mandal;
        string District;
        string state;
    }

    struct Owner{
        string Name;
        string Father_Name;
        uint Aadhar_Number;
        string Pan_Number;
        uint Cost;
        string Date;
    
    }

    mapping(address => bool) public User_Mapping;
    mapping(uint => bool) public SurveyNo_Mapping;
    mapping(uint => address) public SurveyOwner_Mapping;
    //mapping(address => uint) public OwnerSurvey_Mapping;
    mapping(uint => Land) public Land_Mapping;
    mapping(uint => Owner[]) public Owner_Mapping;
    mapping(uint => uint) public OwnerCount;  

    /*constructor() public{
        RegisterLand(123,100,"vij", "kri", "vij","kri", "AP");
        RegisterOwner(123,"Nuru","Siraj",291964219975,"A12345678",1000,28,1,2019);
    }*/

    event OwnerRegistration(uint _surveyNo);
    event Registration(uint _surveyNo);
    //event LandRegistration(uint _surveyNo);
    
    function getLandDetails(uint _SurveyNo) public view returns (uint,uint,string memory,string memory,string memory,string memory,string memory) {
        require(SurveyNo_Mapping[_SurveyNo], "No Land registered to this survey number");
        Land memory land = Land_Mapping[_SurveyNo];
        return (land.surveyNo,land.TotalArea,land.city,land.Revenue_Div,land.Mandal,land.District,land.state);
    }
    
    function getOwnerDetails(uint _SurveyNo, uint _count) public view returns (string memory,string memory,uint ,string memory,uint, string memory) {
        require(SurveyOwner_Mapping[_SurveyNo] == msg.sender, "User not Authorized");
        require(_count <= OwnerCount[_SurveyNo], "No Owner Registered!");
        Owner memory Details = Owner_Mapping[_SurveyNo][_count];
        return (Details.Name, Details.Father_Name, Details.Aadhar_Number, Details.Pan_Number, Details.Cost,Details.Date);
    }
    
    function getPresentAddress() public view returns (address) {
        return msg.sender;
    }
    
    function getOwnerAddress(uint _SurveyNo) public view returns (address) {
        require(SurveyOwner_Mapping[_SurveyNo] == msg.sender, "No registered user");
        return SurveyOwner_Mapping[_SurveyNo];
    }
    
    function CheckUser() public view returns (bool) {
        return User_Mapping[msg.sender];
    }
    
    function CheckSurveyNumber(uint _SurveyNo) public view returns (bool){
        return SurveyNo_Mapping[_SurveyNo];
    }

    function RegisterLand(uint _SurveyNo, uint _TotalArea, string memory _City, string memory _RevenueDist, string memory _Mandal, string memory _District, string memory _State,string memory _Name, string memory _FName, uint _Aadhar, string memory _PAN, uint _Cost, string memory _Date) public {  
        require(!SurveyNo_Mapping[_SurveyNo], "Survey number already registered");
        
        SurveyNo_Mapping[_SurveyNo] = true;
        //OwnerSurvey_Mapping[msg.sender] = _SurveyNo;
        Land_Mapping[_SurveyNo] = Land(_SurveyNo,_TotalArea,_City,_RevenueDist,_Mandal,_District,_State);
        OwnerCount[_SurveyNo] = 0;

        RegisterOwner(_SurveyNo,_Name,_FName,_Aadhar,_PAN,_Cost,_Date,msg.sender);
    }
    
    function RegisterOwner(uint _SurveyNo, string memory _Name, string memory _FName, uint _Aadhar, string memory _PAN, uint _Cost, string memory _Date, address _address) public{
        require(SurveyNo_Mapping[_SurveyNo], "Survey number is not registered");
        
        SurveyOwner_Mapping[_SurveyNo] = _address;
        Owner_Mapping[_SurveyNo].push(Owner(_Name,_FName,_Aadhar,_PAN,_Cost,_Date));
        //uint count = OwnerCount[_SurveyNo];
        OwnerCount[_SurveyNo] ++;
        User_Mapping[_address] = true;

        emit OwnerRegistration(_SurveyNo);
    }

    function getOwnerCount(uint _SurveyNo) public view returns (int){
        if(SurveyOwner_Mapping[_SurveyNo] == msg.sender && User_Mapping[msg.sender])
            return int(OwnerCount[_SurveyNo]);
        else{
            int No = -1;
            return (No);
        }
    }
}
