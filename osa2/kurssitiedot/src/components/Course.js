const Course = (props) => {
    return (
      <div>
      <Header course={props.course} />
      <Content course={props.course} />
      <Total course={props.course} />
      </div>
    )
  }
  
  const Header = (props) => {
    return (
      <h1>{props.course.name}</h1>
    )
  }
  
  const Content = (props) => {
    return (
    <div>
      <Parts
        parts={props.course.parts}
      />
    </div>
    )
  }
  
  const Parts = (props) => {
    const result = props.parts.map(part => <li key={part.id}>{part.name}: {part.exercises}</li>)
  
    return (
      <p>{result}</p>
    )
  }
  
  const Total = (props) => {
    const result = props.course.parts.reduce((s, p) => s = s + p.exercises, 0)
  
    return (
      <p>Total number of exercises: {result}</p>
    )
  }

export default Course