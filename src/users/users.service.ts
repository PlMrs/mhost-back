import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlinkSync } from 'fs';
import { Swipe } from 'src/swipe/entities/swipe.entity';
import { In, IsNull, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {

  //Injection des entités User et Swipe dans des variables
  constructor(
    @InjectRepository(User) private data: Repository<User>,
    @InjectRepository(Swipe) private swipe: Repository<Swipe>
  ) {}

  //Créer un utilisateur en base de données
  create(createUserDto: CreateUserDto): Promise<User> {
    return this.data.save(createUserDto);
  }

  //Cherche tout les utilisateurs en base de données
  findAll(): Promise<User[]> {
    return this.data.find();
  }

  //Trouve les utilisateurs qui n'ont pas encore été swipés par l'utilisateur
  async findNotSwiped(id_user: number, needs_user: string, array_ids: Array<number>): Promise<User[]> {

    let needs: string;

    //Mise dans le tableau de l'identifiant de l'utilisateur
    array_ids.push(id_user)

    //Recherche du besoin à afficher en fonction du besoin de l'utilisateur
    if (needs_user === 'H') {
      needs = "T"
    }
    else if (needs_user === 'T') {
      needs = "H"
    }
    else {
      needs = "D"
    }

    /*Retourne les utilisateurs n'étant pas administrateur, ne correspondant pas aux identifiants stockés
    dans le tableau et ayant le besoin trouvé*/
    return this.data.find({
      select: ["id", "name", "surname", "needs", "picture", "description"],
      where: {
        role: Not(UserRole.ADMIN),
        id: Not(In(array_ids)),
        needs: needs
      }
    })
  }

  //Retourne les utilisateurs trouvé grace à un tableau d'ids
  findAllWithIds(ids: Array<number>): Promise<User[]> {
    return this.data.find({ where: { id: In(ids) } })
  }

  //Retourne un utilisateur en fonction de son identifiant
  findOne(id: number): Promise<User> {
    return this.data.findOneOrFail(id).catch(e => {
      throw new NotFoundException(id);
    });
  }

  //Retourne un utilisateur en fonction de son adresse email
  findByEmail(email: string): Promise<User> {
    return this.data.findOne({ email });
  }

  //Met à jours un utilisateur
  update(id: number, updateUserDto: UpdateUserDto) {
    return this.data.update(id, updateUserDto);
  }

  //Supprime un utilisateur
  remove(id: User): Promise<User> {
    return this.data.remove(id)
  }

  deletePicture(picture: string) {
    if (picture === "default.jpg") {
      return;
    }

    const path = `../front/assets/images/users/picture/${picture}`

    try {
      unlinkSync(path)
      return 200
    } catch (e) {
      console.log(e)
    }
  }

  findNotVerified() {
    return this.data.find({
      where: { carte_id: Not(IsNull()), certificatScolaire: Not(IsNull()), verified: false }
    })
  }
}
