import express from 'express';
import { registerUser, loginUser, submitLoanRequest, 
    generateSlip, 
    getUserData, 
    getLoanRequests} from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/submit-loan', submitLoanRequest);
router.post('//getLoanRequests/:userId', getLoanRequests);
router.post('/generate-slip', generateSlip);



router.get("/profile", getUserData);

// // GET route to fetch all users
// router.get('/getAllUsers', async (req, res) => {
// 	try {
// 	  const users = await User.find({}, 'name email role');
// 	  res.json(users);
// 	} catch (error) {
// 	  console.error('Error fetching users:', error);
// 	  res.status(500).json({ error: 'Internal Server Error' });
// 	}
//   });

// // Modify the getAllUsers route
// router.get('/getAllUsers', async (req, res) => {
// 	try {
// 		const users = await User.find({}, 'name email role');

// 		// Check if each student user exists in the Student database
// 		const usersWithStatus = await Promise.all(users.map(async (user) => {
// 			if (user.role === 'student') {
// 				const studentExists = await Student.findOne({ email: user.email });
// 				return { ...user.toObject(), studentStatus: studentExists ? 'registered' : 'unregistered' };
// 			}
// 			return user.toObject();
// 		}));

// 		res.json(usersWithStatus);
// 	} catch (error) {
// 		console.error('Error fetching users:', error);
// 		res.status(500).json({ error: 'Internal Server Error' });
// 	}
// });



export default router;
