import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class MyDonationScreen extends Component{
    constructor(){
        super()
        this.state={
            userId:firebase.auth().currentUser.email,
            allDonations:[],
            donorName:''
        }
    }

    getUserDetails=()=>{
        db.collection('users').where('email_id','==',this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach(doc=>{var document=doc.data();this.setState({donorName:document.first_name+" "+document.last_name})})
        })
    }

    getAllDonations=()=>{
        db.collection('all_donations').where('donor_id','==', this.state.userId).onSnapshot((snapshot)=>{
            var allDonations=[]
            snapshot.docs.map((doc)=>{var document=doc.data();
            document["doc_id"]=doc.id
            allDonations.push(document)
        })
        this.setState({
            allDonations:allDonations
        })
        })
    }

    sendBook=(item)=>{
      if(item.requestStatus==="Book Sent"){
        var requestStatus="Donor Interested"
        db.collection('all_donations').doc(item.request_id).update({request_status:"Donor Interested"})
        this.sendNotification(item,requestStatus)
      }

      else{
        var requestStatus="Book Sent"
        db.collection('all_donations').doc(item.request_id).update({request_status:"Book Sent"})
        this.sendNotification(item,requestStatus)
      }
    }

    sendNotification=(item,requestStatus)=>{
      db.collection('notification').where('request_id','==',item.request_id).where('donorId','==',item.donorId).get()
      .then((snapshot)=>{snapshot.forEach((doc)=>{var document=doc.data()})})
    }


    componentDidMount(){
        this.getAllDonations();
        this.getUserDetails()
    }

    keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <View>
    <Text>{item.book_name}</Text>
     <ListItem
     key={i}
     title={item.book_name}
     subtitle={"Requested By: " +item.requestedBy}
     titleStyle={{color:"black",fontWeight:"bold"}}
     rightElement={
       <TouchableOpacity
       style={[styles.button,{backgroundColor:item.requestStatus=="Book Sent"?"green":"red"}]}
       onPress={()=>{this.sendBook(item)}}
       >
         <Text style={{color:"#fffff"}}>{item.requestStatus=="Book Sent" ? "Unsend" : "Send Book"}</Text>
       </TouchableOpacity>
     }
     bottomDivider
     >

     </ListItem>
     </View>
    )
  }
    render(){
        return(
            <View>
                <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allDonations}
                renderItem={this.renderItem}
              />
            </View>
        )
    }
}