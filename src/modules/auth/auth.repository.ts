import { genSalt, hash } from 'bcryptjs';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleRepository } from '../role/role.repository';
import { RoleType } from '../role/roletype.enum';
import { UserDetails } from '../user/user.details.entity';
import { User } from '../user/user.entity';
import { SignupDto } from './dto';
import { generate } from 'generate-password';
import { createTransport, SendMailOptions } from 'nodemailer';
import { PlanRepository } from '../plan/plan.repository';
import { Plan } from '../plan/plan.entity';
import { PlanType } from '../plan/plantype.enum';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async signup(sigupDto: SignupDto) {
    const { username, email, password } = sigupDto;
    const user = new User();
    user.username = username;
    user.email = email;
    const rolerepository: RoleRepository = await getConnection().getRepository(
      Role,
    );
    const planesrepository: PlanRepository = await getConnection().getRepository(
      Plan,
    );
    const defaultRole: Role = await rolerepository.findOne({
      where: { name: RoleType.DOCENTE },
    });
    const defaultPlan: Plan = await planesrepository.findOne({
      where: { nombre: PlanType.GENERAL },
    });
    user.roles = [defaultRole];
    user.planes = [defaultPlan];
    const detail = new UserDetails();
    user.details = detail;
    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    user.codigo = generate({
      length: 4,
      numbers: true,
    });

    await user.save();
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'joelpenagonzalez122@gmail.com',
        pass: 'Jancarlos270288',
      },
    });
    const mailOptions = {
      from: 'joelpenagonzalez122@gmail.com',
      to: user.email,
      subject: 'Activation code',
      //text: 'Entre aqui para ver el plan'
      html: `
        <!doctype html>
        <html>
          <style>
          table {
            width: 100%;
            border: 1px solid #000;
            border-collapse: collapse;
          }
          th, td {
            width: 25%;
            text-align: left;
            vertical-align: top;
            border: 1px solid #000;
            border-collapse: collapse;
            padding: 0.8em;
            caption-side: bottom;
          }
          caption {
            padding: 0.3em;
          }
          </style>
            
          <body>  
          <h1>Activation code: </h1> 
          <p> ${user.codigo}</p>
         
            <h6> You can access by the following link:</h6>
            <a href="http://localhost:8080/Codigo/${user.username}">click</a>
          </body>
        </html>
      `,
    };
    console.log('sending email', mailOptions);
    transporter.sendMail(mailOptions, function (error, info) {
      console.log('senMail returned!');
      if (error) {
        console.log('ERROR!!!!!!', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
