export default function HasDeclarativeStyles (Component) {
  return class ComponentWithDeclarativeStyles extends Component {
    getStyles () {
    }
  }
}
