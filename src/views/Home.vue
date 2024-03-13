<template>
  <main>
    <v-container>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field v-model="usdt_rate" label="Rate (USDT/VNĐ)" outlined dense clearable></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-data-table :headers="headers" :items="gmo_list" class="elevation-1" :mobile-breakpoint="0"
            :search="search" fixed-header>
            <template v-slot:[`item.token`]="{ item }">
              {{ item.token }}
            </template>
            <template v-slot:[`item.gmo_rate`]="{ item }">
              {{ formatPrice(item.price) }}
            </template>
            <template v-slot:[`item.bnb_rate`]="{ item }">
              {{ formatPrice(usdt_price(item)) }}
            </template>
            <template v-slot:[`item.rate`]="{ item }">
              {{ formatPrice(usdt_rate/ratio(item)) }}
            </template>
            <template v-slot:[`item.ratio`]="{ item }">
              {{ formatPrice(ratio(item)) }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row>
        <!-- <v-col cols="12" md="2">
          <v-text-field v-model="search" label="Tìm kiếm" outlined dense clearable></v-text-field>
        </v-col> -->
        <v-col cols="12" md="2">
          <v-btn @click="logout()" block>
            Đăng xuất
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      search: '',
      usdt_rate: 25000,
      headers: [
        { text: 'Token', value: 'token', sortable: false, },
        { text: 'GMO', value: 'gmo_rate', sortable: false, },
        { text: 'Binance', value: 'bnb_rate', sortable: false, },
        { text: 'Rate', value: 'rate' },
        { text: 'Ratio', value: 'ratio' },
      ],
      gmo_list: [],
      binance_list: [],
      interval: '',
    }
  },
  mounted() {
    this.getBinance()
    this.getGMO()
    this.getUsdtRate()
    this.interval = setInterval(() => {
      this.getBinance()
      this.getGMO()
      this.getUsdtRate()
    }, 3000);
  },
  methods: {
    logout() {
      localStorage.removeItem('loged')
      this.$router.push("/login")
    },
    getUsdtRate(){
      axios.get('https://api.chootc.com/api/p2p?type=sell&asset=usdt&fiat=vnd&page=1').then((res) => {
        this.usdt_rate = res.data.data[19].adv.price
      }).catch((err) => {
        // location.reload();
      })
    },
    getGMO() {
      axios.get('https://api.chootc.com/api/gmo').then((res) => {
        this.gmo_list = []
        res.data.data.forEach(i => {
        if(i.symbol.includes("JPY") && !i.symbol.includes("LTC")){
          this.gmo_list.push({
            token: i.symbol ,
            price: Number(i.last) + Number(i.last * 0.1 / 100)
          })
        }
       });
      }).catch((err) => {
        // location.reload();
      })
    },
    getBinance() {
      let symbols = ["BTCUSDT", "ETHUSDT", "BCHUSDT", "XRPUSDT"]
      
      axios.get('https://api3.binance.com/api/v3/ticker/price', {
        params: {
          symbols: JSON.stringify(symbols)
        }
      }).then((res) => {
        this.binance_list = []
        res.data.forEach(i => {
          this.binance_list.push({
            token: i.symbol,
            price: Number(i.price) - Number(i.price * 0.1 / 100)
          })
        })
      }).catch((err) => {
        // location.reload();
      })
    },
    ratio(item) {
      let bnb_rate = this.binance_list.filter((i) => item.token.includes(i.token.slice(0,-4)))[0]
      return bnb_rate ? this.usdt_rate/(item.price/ bnb_rate.price) : 0
    },
    usdt_price(item) {
      let token = this.binance_list.filter((i) => item.token.includes(i.token.slice(0,-4)))[0]
      return token ? token.price : 0
    },
    formatPrice(value) {
      if (!value) return 0;
      if (String(value).slice(0, 6) == '0.0000') return parseFloat(value).toFixed(6);
      if (String(value).slice(0, 2) == '0.') return parseFloat(value).toFixed(4);
      return String(parseFloat(value).toFixed(2))
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        .replace('.00', '')
    },
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>