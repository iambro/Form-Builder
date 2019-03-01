const NewInput = props => {
  return (
    <form className="form">
      <div className="form__group">
        <label>Question</label>
        <input
          type="text"
          id={props.id}
          name="question"
          value={props.question}
          onChange={props.handleInputs}
        />
      </div>
      <div className="form__group">
        <label>Type</label>
        <select
          id={props.id}
          name="type"
          value={props.type}
          onChange={props.handleInputs}
        >
          <option value="number">Number</option>
          <option value="text">Text</option>
          <option value="radio">Yes / No</option>
        </select>
      </div>
      <button type="button" id={props.id} onClick={props.handleSubInputClick}>
        Add Sub-Input
      </button>
      <button type="button" id={props.id} onClick={props.handleDeleteButton}>
        Delete
      </button>
    </form>
  );
};

const SubInput = props => {
  return (
    <form style={props.childStyle} className="form">
      <div className="form__group">
        <label>Condition</label>
        <select
          id={props.id}
          name="condition"
          value={props.condition}
          onChange={props.handleInputs}
        >
          <option value="equals">Equals</option>
          {props.conditionOption === "number" && (
            <>
              <option value="greater">Greater than</option>
              <option value="less">Less than</option>
            </>
          )}
        </select>
        <label>Answer</label>
        {props.conditionOption === "radio" ? (
          <select
            id={props.id}
            name="answer"
            value={props.answer}
            onChange={props.handleInputs}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        ) : (
          <input
            type={props.conditionOption}
            id={props.id}
            name="answer"
            value={props.answer}
            onChange={props.handleInputs}
          />
        )}
      </div>
      <div className="form__group">
        <label>Question</label>
        <input
          type="text"
          id={props.id}
          name="question"
          value={props.question}
          onChange={props.handleInputs}
        />
      </div>
      <div className="form__group">
        <label>Type</label>
        <select
          id={props.id}
          name="type"
          value={props.type}
          onChange={props.handleInputs}
        >
          <option value="number">Number</option>
          <option value="text">Text</option>
          <option value="radio">Yes / No</option>
        </select>
      </div>
      <button type="button" id={props.id} onClick={props.handleSubInputClick}>
        Add Sub-Input
      </button>
      <button type="button" id={props.id} onClick={props.handleDeleteButton}>
        Delete
      </button>
    </form>
  );
};

class FormBuilder extends React.Component {
  state = {
    componentsList: []
  };

  handleNewInputClick = () => {
    let list = this.state.componentsList;
    let newIndex = list.length;
    let newList = list.concat({
      id: newIndex,
      compType: NewInput,
      level: 0,
      child: false,
      childsNumber: 0,
      question: "",
      type: "number"
    });

    this.setState({
      componentsList: newList
    });
  };

  handleSubInputClick = e => {
    let list = this.state.componentsList;
    let currentIndex = Number(e.target.id);
    let currentLevel = this.state.componentsList[e.target.id].level;
    list[currentIndex].child = true;
    let style = {
      marginLeft: 30 * (currentLevel + 1) + "px"
    };

    let firstList = list.slice(0, currentIndex + 1);
    let secondList = list.slice(currentIndex + 1, list.length);
    let addedList = firstList.concat({
      id: ++currentIndex,
      compType: SubInput,
      level: ++currentLevel,
      child: false,
      childsNumber: 0,
      question: "",
      type: "number",
      condition: "equals",
      answer: "",
      conditionOption: this.state.componentsList[e.target.id].type,
      childStyle: style
    });

    secondList.forEach(component => component.id++);
    let newList = addedList.concat(secondList);
    this.setState({
      componentsList: newList
    });
  };

  calculateChild() {
    let list = this.state.componentsList;
    let i, j;
    let childs = 0;
    for (i = 0; i < list.length; i++) {
      for (j = i + 1; j < list.length; j++) {
        if (
          this.state.componentsList[i].level <
          this.state.componentsList[j].level
        ) {
          childs++;
        } else {
          break;
        }
      }
      list[i].childsNumber = childs;
      this.setState({ list });
      childs = 0;
    }
  }

  handleDeleteButton = e => {
    this.calculateChild();
    let list = this.state.componentsList;
    let childs = Number(list[e.target.id].childsNumber);
    let currentIndex = Number(e.target.id);
    let lastChildId = childs + currentIndex;

    let firstList = list.slice(0, currentIndex);
    let secondList = list.slice(lastChildId + 1, list.length);

    secondList.forEach(component => (component.id = component.id - childs - 1));
    let newList = firstList.concat(secondList);
    this.setState({
      componentsList: newList
    });
  };

  handleInputs = e => {
    const list = this.state.componentsList;
    let childId = Number(e.target.id) + 1;
    if (e.target.name === "question") {
      list[e.target.id].question = e.target.value;
      this.setState({ list });
    } else if (e.target.name === "type") {
      list[e.target.id].type = e.target.value;
      list[e.target.id].child
        ? (list[childId].conditionOption = list[e.target.id].type)
        : null;
      list[e.target.id].child;
      this.setState({ list });
    } else if (e.target.name === "condition") {
      list[e.target.id].condition = e.target.value;
      this.setState({ list });
    } else if (e.target.name === "answer") {
      list[e.target.id].answer = e.target.value;
      this.setState({ list });
    }
  };

  render() {
    const components = this.state.componentsList.map(component => (
      <component.compType
        key={component.id}
        id={component.id}
        level={component.level}
        question={component.question}
        type={component.type}
        condition={component.condition}
        conditionOption={component.conditionOption}
        answer={component.answer}
        handleSubInputClick={this.handleSubInputClick}
        handleInputs={this.handleInputs}
        handleDeleteButton={this.handleDeleteButton}
        childStyle={component.childStyle}
      />
    ));
    return (
      <React.Fragment>
        <h1>Form Builder</h1>
        {components}
        <button onClick={this.handleNewInputClick}>Add Input</button>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<FormBuilder />, document.getElementById("root"));
