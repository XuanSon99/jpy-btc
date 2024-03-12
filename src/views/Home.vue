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
            <template v-slot:[`item.ratio`]="{ item }">
              {{ ratio(item) }}
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
    }, 5000);
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
        location.reload();
      })
    },
    getGMO() {
      axios.get('https://api.chootc.com/api/gmo').then((res) => {
        this.gmo_list = []
        res.data.data.forEach(i => {
        if(i.symbol.includes("JPY")){
          this.gmo_list.push({
            token: i.symbol ,
            price: Number(i.last) - Number(i.last * 0.05 / 100)
          })
        }
       });
      }).catch((err) => {
        location.reload();
      })
    },
    getBinance() {
      let symbols = ["BTCUSDT", "ETHUSDT", "ETCUSDT", "XRPUSDT", "BCHUSDT", "QTUMUSDT", "BTGUSDT", "EOSUSDT", "ICXUSDT", "TRXUSDT", "ELFUSDT", "KNCUSDT", "GLMUSDT", "ZILUSDT", "WAXPUSDT", "POWRUSDT", "LRCUSDT", "STEEMUSDT", "STRAXUSDT", "ZRXUSDT", "SNTUSDT", "ADAUSDT", "CTXCUSDT", "BATUSDT", "THETAUSDT", "LOOMUSDT", "WAVESUSDT", "LINKUSDT", "ENJUSDT", "VETUSDT", "MTLUSDT", "IOSTUSDT", "QKCUSDT", "TFUELUSDT", "ANKRUSDT", "CHRUSDT", "MBLUSDT", "SXPUSDT", "COSUSDT", "HIVEUSDT", "ARPAUSDT", "CKBUSDT", "AERGOUSDT", "YFIUSDT", "UNIUSDT", "UMAUSDT", "COMPUSDT", "RSRUSDT", "AAVEUSDT", "RLCUSDT", "NMRUSDT", "BALUSDT", "RENUSDT", "SANDUSDT", "BELUSDT", "STPTUSDT", "GRTUSDT", "OXTUSDT", "LINAUSDT", "SNXUSDT", "CTSIUSDT", "PLAUSDT", "MANAUSDT", "LPTUSDT", "MKRUSDT", "CELRUSDT", "PUNDIXUSDT", "FRONTUSDT", "SUSHIUSDT", "OCEANUSDT", "COTIUSDT", "BNTUSDT", "CAKEUSDT", "XVSUSDT", "OGNUSDT", "ALICEUSDT", "CHZUSDT", "AXSUSDT", "DAIUSDT", "WOOUSDT", "ONTUSDT", "SHIBUSDT", "ONGUSDT", "MATICUSDT", "ALGOUSDT", "KLAYUSDT", "BNBUSDT", "SUNUSDT", "XLMUSDT", "XECUSDT", "AGIXUSDT", "SOLUSDT", "XTZUSDT", "JSTUSDT", "DOTUSDT", "ATOMUSDT", "CTKUSDT", "REIUSDT", "EGLDUSDT", "MASKUSDT", "CRVUSDT", "1INCHUSDT", "C98USDT", "DYDXUSDT", "FLOWUSDT", "BTTUSDT", "JASMYUSDT", "GALAUSDT", "REQUSDT", "AVAXUSDT", "GMTUSDT", "DARUSDT", "ACHUSDT", "SFPUSDT", "KSMUSDT", "TUSDT", "DOGEUSDT", "APTUSDT", "HOOKUSDT", "APEUSDT", "OPUSDT", "GMXUSDT", "STXUSDT", "CFXUSDT", "HFTUSDT", "ILVUSDT", "LEVERUSDT", "WLDUSDT", "SEIUSDT", "FXSUSDT", "IMXUSDT", "ARBUSDT", "RPLUSDT", "INJUSDT", "CELOUSDT", "FTMUSDT", "LDOUSDT", "FLOKIUSDT", "FETUSDT", "RNDRUSDT", "STGUSDT", "SUIUSDT", "MAVUSDT", "PEPEUSDT"]
      
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
        location.reload();
      })
    },
    ratio(item) {
      let bnb_rate = this.binance_list.filter((i) => item.token.includes(i.token.slice(0,-4)))[0]
      return bnb_rate ? this.formatPrice(this.usdt_rate/(item.price/ bnb_rate.price)) : 0
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