interface courseProps {
  name: string;
  parts: { name: string; exerciseCount: number; }[]
}

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  return (
    <div>
      <Header name={courseName} parts={courseParts} />
      <Content name={courseName} parts={courseParts} />
      <Total name={courseName} parts={courseParts} />
    </div>
  );
};

const Header = (props: courseProps): JSX.Element => {

  return <h1>{props.name}</h1>
}

const Content = (props: courseProps): JSX.Element => {

  return (
    <div>
      <p>
        {props.parts[0].name} {props.parts[0].exerciseCount}
      </p>
      <p>
        {props.parts[1].name} {props.parts[1].exerciseCount}
      </p>
      <p>
        {props.parts[2].name} {props.parts[2].exerciseCount}
      </p>
    </div>
  )
}

const Total = (props: courseProps): JSX.Element => {

  return (
    <p>
    Number of exercises{" "}
    {props.parts.reduce((carry, part) => carry + part.exerciseCount, 0)}
  </p>
  )
}

export default App;
