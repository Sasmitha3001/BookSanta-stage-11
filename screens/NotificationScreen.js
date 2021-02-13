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
import SwipeableFlatList from '../components/SwipeableFlatList';

export default class NotificationScreen extends Component{
    constructor(){
        super()
        this.state={
            userId:firebase.auth().currentUser.email,
            allNotification:[]
        }
    }

    getNotifications=()=>{
        db.collection('notification').where('notificationStatus','==','unread').where('donor_id','==',this.state.userId)
        .onSnapshot((snapshot)=>{
            var allNotification=[]
            snapshot.docs.map((doc)=>{var document=doc.data();
            document["doc_id"]=doc.id
            allNotification.push(document)
        })
        this.setState({
           allNotification:allNotification
        })
        })
    }

    componentDidMount(){
        this.getNotifications()
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
       style={styles.button}
       >
         <Text style={{color:"green"}}>Send Book</Text>
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
                {/* <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allNotification}
                renderItem={this.renderItem}
              /> */}
              {/* <MyHeader 
              title={"Notification Screen"}
              navigation={this.props.navigation}
              />
              {this.state.allNotification.length==0 ?(<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text>You have no notifications</Text>
              </View>):(<SwipeableFlatList 
              allNotifications={this.state.allNotification}/>) } */}
            </View>
        )
    }
}