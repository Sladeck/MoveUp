<template>
    <div>
        <form name="joinRoom" @submit.prevent>
            <div>{{user.name}}</div>
            <input type="submit" name="submit" @click.prevent="join" value="Join this room">
        </form>
    </div>
</template>

<script>
export default {
    name: "room-card",

    /*props : {
        user : { type: Object, required : true }
    },*/

    /*computed: {
        fullname() {
            return this.user.firstname + ' ' + this.user.lastname
        }
    },
    */
    methods: {
        join(){
            this.$emit("join", this.user)
        }
    }
}
</script>
