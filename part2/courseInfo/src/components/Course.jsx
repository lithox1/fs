const Course = ({ course }) => {
    return course.map(c => {
        return (
            <div key={c.id}>
                <Header name={c.name} />
                <Content parts={c.parts} />
                <Total parts={c.parts} />
            </div>
        )
    })
}

const Header = ({ name }) => <h2>{name}</h2>

const Total = ({ parts }) => {
    const total = parts.reduce((tot, parts) => {
        return tot + parts.exercises
    }, 0)

    return <p><b>total of {total} exercises</b></p>
}

const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

const Content = ({ parts }) => parts.map(p => <Part key={p.id} part={p} />)

export default Course