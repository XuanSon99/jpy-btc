<template>
    <main class="login">
        <v-card class="px-7 py-7">
            <h1 class="text-center mb-5">Đăng nhập</h1>
            <v-form v-model="valid">
                <v-text-field v-model="username" outlined label="Tài khoản" :rules="rules"></v-text-field>
                <v-text-field v-model="password" outlined type="password" label="Mật khẩu" :rules="rules"
                    class="my-3"></v-text-field>
                <v-btn color="primary" x-large block @click="login" :disabled="!valid">
                    Đăng nhập
                </v-btn>
            </v-form>
        </v-card>
    </main>
</template>
  
<script>
export default {
    data() {
        return {
            rules: [(v) => !!v || "Không được bỏ trống"],
            valid: false,
            username: "admin",
            password: "",
        };
    },
    methods: {
        login() {
            if (this.username == "admin" && this.password == "admin123@") {
                localStorage.setItem("loged", 1)
                this.$router.push("/")
                return
            }
            this.$toast.error("Tài khoản hoặc mật khẩu không đúng")
        }
    },
};
</script>
  
<style>
.login {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #222;
}

.login .v-card {
    width: 400px;
}
</style>