import User from './model/userinfo';

export const resolvers ={
    Query:{
        hello: () =>{
            return "Hello My Cookie Test Server!";
        },
        allUser: async () => {
            return await User.find();
        }
    },

    Mutation:{
        addUser: async (_,{input}) =>{
            return await User.create(input);
        }
    }
}