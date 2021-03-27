const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Joi = require('joi');
const app = express();

app.use(bodyParser.json());
app.use(morgan('tiny'));

const courses = [
	{ id: 1, name: 'course 1' },
	{ id: 2, name: 'course 2' },
	{ id: 3, name: 'course 3' }
];

// let courses = [
// 	{ id: 1, name: 'course 1' },
// 	{ id: 2, name: 'course 2' },
// 	{ id: 3, name: 'course 3' }
// ];

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/api/courses', (req, res) => {
	res.json(courses);
});

app.post('/api/courses/', (req, res) => {
	// Validate
	const { error } = validateCourse(req.body);

	if (error) {
		res.send(error.details[0].message);
		return;
	}

	const course = {
		id: courses.length + 1,
		name: req.body.name
	};

	courses.push(course);

	res.send(courses);
});

app.put('/api/courses/:id', (req, res) => {
	// Lookup
	const course = courses.find((c) => c.id === parseInt(req.params.id));
	if (!course) {
		res.status(404).send('The user doesnt exist in the database');
		return;
	}

	// Validate
	const { error } = validateCourse(req.body);

	if (error) {
		res.send(error.details[0].message);
		return;
	}

	// Update name provide feedback
	course.name = req.body.name;
	res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
	const course = courses.find((c) => c.id === parseInt(req.params.id));
	if (!course) {
		res.status(404).send('This user doesnt exist in our database');
	}

	const index = courses.indexOf(course);
	courses.splice(index, 1);
	// courses = courses.filter((course) => course.id !== parseInt(req.params.id));

	res.send(course);
});

const validateCourse = (course) => {
	const schema = Joi.object({
		name: Joi.string().min(3).required()
	});

	const result = schema.validate(course);

	return result;
};

const port = process.env.PORT || 4000;

app.listen(port, () => console.log('Server connected'));
