import User from './model/userinfo';

export const resolvers ={
    Query:{
        hello: () =>{
            return "Hello My Cookie Test Server!";
        },
        allUser: async () => {
            return await User.find();
        },
        getByIdUser: async (_,{_userID}) =>{
            return await User.findOne({_userID:_userID});
        }
    },

    Mutation:{
        addUser: async (_,{input}) =>{
            return await User.create(input);
        }
    }
}