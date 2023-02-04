import User from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const userFriends = await Promise.all(
      user.friend.map((id) => User.findById(id))
    );

    const formattedFriends = userFriends.map(
      ({ _id, firstName, lastName, occupation, location, picPath }) => {
        return { _id, firstName, lastName, occupation, location, picPath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ errpr: err.message });
  }
};

export const addRemoveFriends = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const userFriends = await Promise.all(
      user.friend.map((id) => User.findById(id))
    );

    const formattedFriends = userFriends.map(
      ({ _id, firstName, lastName, occupation, location, picPath }) => {
        return { _id, firstName, lastName, occupation, location, picPath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
