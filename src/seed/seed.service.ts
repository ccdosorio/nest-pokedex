import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  private readonly URL_POKE_API = 'https://pokeapi.co/api/v2/pokemon?limit=650';

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany().exec();
    const data = await this.http.get<PokeResponse>(this.URL_POKE_API);

    const pokemonsToInsert = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      return { name, no };
    });

    await this.pokemonModel.insertMany(pokemonsToInsert);

    return 'Seed execute';
  }
}
