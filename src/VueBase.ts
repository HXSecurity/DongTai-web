import {Vue} from "vue-property-decorator"
import services from '@/services'

export default class VueBase extends Vue{
  public services = services
}
