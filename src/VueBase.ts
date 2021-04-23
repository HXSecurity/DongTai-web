import { Vue } from 'vue-property-decorator'
import services from '@/services'

export default class VueBase extends Vue {
  public services = services

  private lockStack: Array<number> = [] // 锁栈
  private loading: any
  loadingStart() {
    if (!this.lockStack.length) {
      this.loading = this.$loading({
        background: 'rgba(0,0,0,0)',
        text: '正在加载...',
      })
    }
    this.lockStack.push(1)
  }
  loadingDone() {
    if (this.lockStack.length <= 1) {
      this.loading.close()
    }
    this.lockStack.pop()
  }

  rolesCheck(roles: string[], flag: boolean) {
    if (flag) {
      return roles.some(
        (item) => item === this.$store.getters.userInfo.role_name
      )
    } else {
      return !roles.some((item) => item === this.$store.getters.userInfo)
    }
  }
}
