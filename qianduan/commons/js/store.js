//store.js
export const store = {
  state:{
      name: "默认值",
      imgurl: "error.png",
      token: "",
      id: "0"
  },
  setUsg(type,value){
    this.state[type] = value
  }
}