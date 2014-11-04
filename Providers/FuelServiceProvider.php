<?php

/*
 * This file is part of the FuelPHP Menu package.
 *
 * (c) Indigo Development Team
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Indigo\Theme\Indigo\Providers;

use Fuel\Dependency\ServiceProvider;

/**
 * Provides twig services
 *
 * @author Márk Sági-Kazár <mark.sagikazar@gmail.com>
 */
class FuelServiceProvider extends ServiceProvider
{
	/**
	 * {@inheritdoc}
	 */
	public $provides = true;

	/**
	 * {@inheritdoc}
	 */
	public function provide()
	{
		// menu extension
		$this->extend('parser.twig', function($dic, $instance)
		{
			$rendererProvider = $dic->resolve('menu.renderer_provider');
			$menuProvider = $dic->resolve('menu.provider');

			$helper = $dic->resolve('Knp\\Menu\\Twig\\Helper', [$rendererProvider, $menuProvider]);

			$extension = $dic->resolve('Knp\\Menu\\Twig\\MenuExtension', [$helper]);

			$twig = $instance->getTwig();

			$twig->addExtension($extension);

			return $instance;
		});

		$this->extend('menu.renderer.fuel', function($dic, $instance)
		{
			$instance->setDefaultTemplate('knp_menu.html.twig');

			return $instance;
		});
	}
}
